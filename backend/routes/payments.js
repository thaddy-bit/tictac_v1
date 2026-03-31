const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');
const MOMOService = require('../services/momo-service');
const notificationService = require('../services/notificationService');
const logs = require('../config/logger');
const PLATFORM_CONSTANTS = require('../config/constants');
const { generateRandomId } = require('../services/idGenerator');

// Instance du service MTN MOMO
const momoService = new MOMOService();

// Initialiser une transaction de paiement
router.post('/initiate', auth, [
  body('medicament_search').custom(value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return typeof value === 'string' && value.trim().length >= 2;
  }).withMessage('La recherche doit contenir au moins un médicament valide'),
  body('phone').custom(value => {
    if (!value || !value.match(/^\+242\d{9}$/)) {
      throw new Error('Numéro de téléphone congolais invalide (format: +242XXXXXXXXX)');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logs.error('Payment validation errors', { errors: errors.array(), userId: req.user?.id });
      return res.status(400).json({ errors: errors.array() });
    }

    let { medicament_search, phone } = req.body;
    const userId = req.user.id;
    const amount = PLATFORM_CONSTANTS.SEARCH_FEE;

    // Si c'est un tableau (multi-médicaments), transformer en chaîne pour la DB et MOMO
    if (Array.isArray(medicament_search)) {
      medicament_search = medicament_search.join(', ');
    }

    // Créer la transaction en base de données
    const payment_method = req.body.payment_method || 'mtn';
    const transactionId = generateRandomId(12);
    await db.query(
      'INSERT INTO transactions (id, user_id, medicament_search, amount, type, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transactionId, userId, medicament_search, amount, 'payment', payment_method, 'pending']
    );

    // Logique selon le mode de paiement
    if (payment_method === 'wallet') {
      // Vérifier le solde de l'utilisateur
      const user = await db.query('SELECT wallet_balance FROM users WHERE id = ?', [userId]);
      if (user[0].wallet_balance < amount) {
        await db.query('UPDATE transactions SET status = ? WHERE id = ?', ['failed', transactionId]);
        return res.status(400).json({ error: 'Solde insuffisant dans votre portefeuille' });
      }

      // Déduire du portefeuille et finaliser la transaction
      await db.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [amount, userId]);
      await db.query('UPDATE transactions SET status = ?, completed_at = NOW() WHERE id = ?', ['completed', transactionId]);
      
      logs.info('💰 Payment completed via Wallet', { transactionId, userId, amount });

      return res.json({
        transaction_id: transactionId,
        amount: amount,
        status: 'completed',
        message: 'Paiement effectué via portefeuille'
      });
    }

    logs.info('💳 Payment initiated via Mobile Money', { transactionId, userId, phone, amount, medicament_search });

    // Initier le paiement Mobile Money
    try {
      const paymentResult = await momoService.initiatePayment({
        phoneNumber: phone,
        amount: amount,
        medicament_search: medicament_search
      });

      // Mettre à jour la transaction avec la référence Mobile Money
      await db.query(
        'UPDATE transactions SET mobile_money_ref = ? WHERE id = ?',
        [paymentResult.payment_reference, transactionId]
      );

      res.json({
        transaction_id: transactionId,
        payment_reference: paymentResult.payment_reference,
        amount: amount,
        status: 'pending',
        message: paymentResult.message
      });

    } catch (mobileMoneyError) {
      // En cas d'erreur avec Mobile Money, marquer la transaction comme échouée
      await db.query(
        'UPDATE transactions SET status = ? WHERE id = ?',
        ['failed', transactionId]
      );
      
      logs.error('❌ Mobile Money payment failed', { transactionId, userId, error: mobileMoneyError.message });
      res.status(500).json({ 
        error: 'Erreur lors de l\'initialisation du paiement Mobile Money',
        details: mobileMoneyError.message 
      });
    }

  } catch (error) {
    logs.error('❌ Payment initiation error', { error: error.message, stack: error.stack, userId: req.user?.id });
    res.status(500).json({ error: 'Erreur lors de l\'initialisation du paiement' });
  }
});

// Recharger le portefeuille (Top-up)
router.post('/wallet/topup', auth, [
  body('amount').isFloat({ min: 100 }).withMessage('Le montant minimum est de 100 FCFA'),
  body('phone').matches(/^\+242\d{9}$/).withMessage('Numéro de téléphone congolais invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, phone } = req.body;
    const userId = req.user.id;

    // Créer une transaction de type 'topup'
    const transactionId = generateRandomId(12);
    await db.query(
      'INSERT INTO transactions (id, user_id, amount, type, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, userId, amount, 'topup', 'mtn', 'pending']
    );

    // Initier le paiement Mobile Money
    const paymentResult = await momoService.initiatePayment({
      phoneNumber: phone,
      amount: amount,
      medicament_search: 'Recharge Portefeuille TICTAC'
    });

    await db.query(
      'UPDATE transactions SET mobile_money_ref = ? WHERE id = ?',
      [paymentResult.payment_reference, transactionId]
    );

    res.json({
      transaction_id: transactionId,
      payment_reference: paymentResult.payment_reference,
      amount,
      status: 'pending'
    });

  } catch (error) {
    logs.error('Wallet topup error', { error: error.message });
    res.status(500).json({ error: 'Erreur lors de la recharge' });
  }
});

// Vérifier le statut d'une transaction
router.get('/status/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    // Vérifier que la transaction appartient à l'utilisateur
    const transaction = await db.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );

    if (transaction.length === 0) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    const transactionData = transaction[0];

    // Mode démo: simuler la validation après 5 secondes
    if (transactionData.status === 'pending' && transactionData.mobile_money_ref) {
      const createdTime = new Date(transactionData.created_at).getTime();
      const currentTime = Date.now();
      const timeDiff = (currentTime - createdTime) / 1000; // en secondes
      
      logs.info(`🧪 Mode démo: Vérification transaction ${transactionId}`, { timeDiff });
      
      // Simuler la validation après 5 secondes
      if (timeDiff >= 5) {
        logs.info(`✅ Mode démo: Validation automatique de la transaction ${transactionId}`);
        
        // Mettre à jour la transaction et créer la session de recherche
        await db.query(
          'UPDATE transactions SET status = ?, completed_at = NOW() WHERE id = ?',
          ['completed', transactionId]
        );

        // Si c'est une recharge, créditer le portefeuille
        if (transactionData.type === 'topup') {
          await db.query(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [transactionData.amount, userId]
          );
          logs.info('💸 Wallet credited (mode démo)', { userId, amount: transactionData.amount });
        }

        transactionData.status = 'completed';
        logs.info('✅ Payment completed (mode démo)', { transactionId, userId, amount: transactionData.amount, type: transactionData.type });
        
        // Envoyer une notification push de confirmation
        try {
          await notificationService.sendPaymentNotification(userId, transactionId, 'completed', transactionData.amount);
        } catch (notifError) {
          logs.error('❌ Notification error', { error: notifError.message });
        }
      } else {
        logs.info(`⏳ Mode démo: Transaction ${transactionId} en attente`, { remainingTime: 5 - Math.floor(timeDiff) });
      }
    }

    res.json({
      transaction_id: transactionId,
      status: transactionData.status,
      amount: transactionData.amount,
      created_at: transactionData.created_at,
      completed_at: transactionData.completed_at
    });

  } catch (error) {
    logs.error('❌ Status check error', { error: error.message });
    res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
  }
});

// Webhook pour recevoir les notifications de MTN MOMO
router.post('/webhook', async (req, res) => {
  try {
    logs.info('📥 Webhook MTN MOMO reçu', { body: req.body });

    // Traiter le webhook avec le service MTN MOMO
    const webhookResult = await momoService.handleWebhook(req.body);

    // Mettre à jour la transaction dans la base de données
    const transaction = await db.query(
      'SELECT * FROM transactions WHERE mobile_money_ref = ?',
      [webhookResult.transaction_id]
    );

    if (transaction.length > 0) {
      const transactionData = transaction[0];
      
      if (webhookResult.status === 'completed') {
        await db.query(
          'UPDATE transactions SET status = ?, completed_at = NOW() WHERE id = ?',
          ['completed', transactionData.id]
        );

        // Si c'est une recharge, créditer le portefeuille
        if (transactionData.type === 'topup') {
          await db.query(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [transactionData.amount, transactionData.user_id]
          );
          logs.info('💸 Wallet credited via Webhook', { userId: transactionData.user_id, amount: transactionData.amount });
        }
      } else if (webhookResult.status === 'failed') {
        await db.query(
          'UPDATE transactions SET status = ? WHERE id = ?',
          ['failed', transactionData.id]
        );
      }
    }

    res.json({ status: 'received', ...webhookResult });

  } catch (error) {
    logs.error('❌ Erreur lors du traitement du webhook MTN MOMO', { error: error.message });
    res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
  }
});

module.exports = router;

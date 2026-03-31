const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, phone, first_name, last_name, email, role, wallet_balance, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Erreur lors du chargement du profil' });
  }
});

// Get user search and transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const history = await db.query(
      `SELECT 
        ss.id as session_id,
        ss.search_query,
        ss.results_count,
        ss.created_at as search_date,
        ss.expires_at,
        t.id as transaction_id,
        t.amount,
        t.status as transaction_status,
        t.created_at as transaction_date
      FROM search_sessions ss
      LEFT JOIN transactions t ON ss.transaction_id = t.id
      WHERE t.user_id = ?
      ORDER BY ss.created_at DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Erreur lors du chargement de l\'historique' });
  }
});

// Obtenir toutes les transactions de l'utilisateur (Recharges + Paiements)
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des transactions' });
  }
});

// Modifier le mot de passe
router.post('/security/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
        const isMatch = await bcrypt.compare(currentPassword, user[0].password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ success: true, message: 'Mot de passe mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Soumettre un ticket de support
router.post('/support', auth, async (req, res) => {
    const { subject, message } = req.body;
    try {
        await db.query(
            'INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)',
            [req.user.id, subject, message]
        );
        res.json({ success: true, message: 'Ticket envoyé avec succès' });
    } catch (error) {
        console.error('Support ticket error:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du ticket' });
    }
});

// Obtenir les notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const notifications = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [req.user.id]
        );
        res.json(notifications);
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ error: 'Erreur notifications' });
    }
});

// Marquer une notification comme lue
router.put('/notifications/:id/read', auth, async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur mark as read' });
    }
});

module.exports = router;

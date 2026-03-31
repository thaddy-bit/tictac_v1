const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const PLATFORM_CONSTANTS = require('../config/constants');
const { generateRandomId } = require('../services/idGenerator');

const SEARCH_FEE = PLATFORM_CONSTANTS.SEARCH_FEE;

// Helper pour vérifier si une pharmacie est ouverte
const isPharmacyOpen = (type, isOnGarde) => {
  const hour = new Date().getHours();
  switch (type) {
    case 'mixte': return true;
    case 'jour': return hour >= 8 && hour < 20;
    case 'nuit': return hour >= 20 || hour < 8;
    case 'garde': return !!isOnGarde;
    default: return hour >= 8 && hour < 20;
  }
};

// Initialiser une recherche
// Si transactionId fourni → paiement déjà effectué (via PaymentModal/payments.js)
// Sinon → paiement par wallet directement
router.post('/initiate', auth, async (req, res) => {
  try {
    // Seul le rôle 'user' peut initier une nouvelle recherche payante
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Accès refusé - Seuls les clients peuvent initier une recherche' });
    }

    const { medicamentIds, transactionId } = req.body;
    if (!medicamentIds || !Array.isArray(medicamentIds)) {
      return res.status(400).json({ error: 'Liste de médicaments invalide' });
    }

    const searchQuery = JSON.stringify(medicamentIds);
    let txId = transactionId;

    if (txId) {
      // Paiement déjà effectué — vérifier que la transaction existe et appartient à l'utilisateur
      const tx = await db.query(
        "SELECT id FROM transactions WHERE id = ? AND user_id = ? AND status = 'completed'",
        [txId, req.user.id]
      );
      if (tx.length === 0) {
        return res.status(400).json({ error: 'Transaction invalide ou non complétée' });
      }
    } else {
      // Paiement wallet direct
      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();
        const [[user]] = await conn.query('SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
        if (user.wallet_balance < SEARCH_FEE) {
          await conn.rollback();
          return res.status(400).json({ error: 'Solde insuffisant pour débloquer la recherche' });
        }
        const [txResult] = await conn.query(
          `INSERT INTO transactions (user_id, amount, type, status, payment_method, medicament_search) 
           VALUES (?, ?, 'payment', 'completed', 'wallet', ?)`,
          [req.user.id, SEARCH_FEE, searchQuery]
        );
        await conn.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [SEARCH_FEE, req.user.id]);
        txId = txResult.insertId;
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }

    // Créer la session de recherche
    const sessionId = generateRandomId(12);
    await db.query(
      'INSERT INTO search_sessions (id, transaction_id, search_query) VALUES (?, ?, ?)',
      [sessionId, txId, searchQuery]
    );
    
    res.json({ sessionId, message: 'Recherche débloquée avec succès' });

  } catch (error) {
    console.error('Initiate search error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation de la recherche' });
  }
});

// Récupérer les résultats d'une session
router.get('/results/:sessionId', auth, async (req, res) => {
  try {
    // Accès réservé aux clients et admins (lecture seule pour support)
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé aux pharmacies pour l\'espace recherche' });
    }

    // JOIN avec transactions pour vérifier que la session appartient à l'utilisateur
    // Sauf pour l'admin qui peut tout voir
    let sessionQuery = `
      SELECT ss.*, t.user_id, TIMESTAMPDIFF(SECOND, ss.created_at, UTC_TIMESTAMP()) AS age_seconds
      FROM search_sessions ss
      JOIN transactions t ON ss.transaction_id = t.id
      WHERE ss.id = ?`;
    let queryParams = [req.params.sessionId];

    if (req.user.role !== 'admin') {
      sessionQuery += ` AND t.user_id = ?`;
      queryParams.push(req.user.id);
    }

    const sessions = await db.query(sessionQuery, queryParams);

    if (sessions.length === 0) {
      return res.status(404).json({ error: 'Session de recherche introuvable' });
    }

    const session = sessions[0];
    
    // Vérifier l'expiration (1 heure) via UTC côté DB (indépendant du fuseau serveur)
    if (Number(session.age_seconds) > 3600) {
      return res.status(410).json({ 
        error: 'Cette session de recherche a expiré (validité 1h)',
        isExpired: true 
      });
    }

    const medicamentIds = JSON.parse(session.search_query);
    
    // Récupérer les détails des médicaments demandés
    const medications = await db.query(
      'SELECT id, name, generic_name, category FROM medicaments WHERE id IN (?)',
      [medicamentIds]
    );

    // Récupérer les stocks par pharmacie
    const searchResults = await db.query(
      `SELECT 
        p.id as pharmacy_id, p.name as pharmacy_name, p.address, p.phone, p.latitude as lat, p.longitude as lng,
        p.type as pharmacy_type, p.is_on_garde,
        m.id as medicament_id, m.name as medicament_name, s.price, s.quantity
      FROM pharmacies p
      JOIN stocks s ON p.id = s.pharmacy_id
      JOIN medicaments m ON s.medicament_id = m.id
      WHERE p.is_active = TRUE AND s.quantity > 0
      AND m.id IN (?)`,
      [medicamentIds]
    );

    // Grouper par pharmacie
    const groups = {};
    searchResults.forEach(row => {
      if (!groups[row.pharmacy_id]) {
        groups[row.pharmacy_id] = {
          pharmacy: {
            id: row.pharmacy_id,
            name: row.pharmacy_name,
            address: row.address,
            phone: row.phone,
            lat: row.lat,
            lng: row.lng,
            type: row.pharmacy_type,
            is_on_garde: row.is_on_garde,
            is_open: isPharmacyOpen(row.pharmacy_type, row.is_on_garde)
          },
          items: []
        };
      }
      groups[row.pharmacy_id].items.push({
        medicament_id: row.medicament_id,
        name: row.medicament_name,
        price: row.price,
        quantity: row.quantity
      });
    });

    // Trier par nombre de médicaments disponibles
    const sortedResults = Object.values(groups).sort((a, b) => b.items.length - a.items.length);

    res.json({
      sessionId: session.id,
      timestamp: session.created_at,
      medications,
      results: sortedResults
    });

  } catch (error) {
    console.error('Fetch results error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des résultats' });
  }
});

// Historique des recherches de l'utilisateur
router.get('/history', auth, async (req, res) => {
  try {
    // Accès réservé aux clients et admins
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé aux pharmacies pour l\'espace recherche' });
    }

    // L'admin peut voir tout l'historique récent, l'user seulement le sien
    let historyQuery = `
       SELECT ss.id, ss.created_at as timestamp, ss.search_query
       FROM search_sessions ss
       JOIN transactions t ON ss.transaction_id = t.id`;
    let queryParams = [];

    if (req.user.role !== 'admin') {
      historyQuery += ` WHERE t.user_id = ?`;
      queryParams.push(req.user.id);
    }

    historyQuery += ` ORDER BY ss.created_at DESC LIMIT ?`;
    queryParams.push(PLATFORM_CONSTANTS.MAX_HISTORY_LIMIT);

    const history = await db.query(historyQuery, queryParams);

    // Pour chaque entrée, on veut les noms des médicaments pour l'affichage léger
    const allMedsIds = [...new Set(history.flatMap(h => {
      try { return JSON.parse(h.search_query); } catch { return []; }
    }))];
    
    let allMeds = [];
    if (allMedsIds.length > 0) {
      allMeds = await db.query('SELECT id, name FROM medicaments WHERE id IN (?)', [allMedsIds]);
    }

    const results = history.map(h => {
      let ids = [];
      try { ids = JSON.parse(h.search_query); } catch {}
      return {
        id: h.id,
        timestamp: h.timestamp,
        meds: allMeds.filter(m => ids.includes(m.id))
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// Toutes les routes ici nécessitent d'être admin
router.use(adminAuth);

// Obtenir les statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) as count FROM users');
    const pharmacyCount = await db.query('SELECT COUNT(*) as count FROM pharmacies');
    const medicineCount = await db.query('SELECT COUNT(*) as count FROM medicaments');
    
    const revenue = await db.query(
      "SELECT SUM(amount) as total FROM transactions WHERE status = 'completed' AND type = 'payment'"
    );
    
    const topups = await db.query(
      "SELECT SUM(amount) as total FROM transactions WHERE status = 'completed' AND type = 'topup'"
    );

    // Statistiques des 7 derniers jours
    const last7Days = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as amount
      FROM transactions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      summary: {
        users: userCount[0].count,
        pharmacies: pharmacyCount[0].count,
        medicines: medicineCount[0].count,
        revenue: revenue[0].total || 0,
        topups: topups[0].total || 0
      },
      activity: last7Days
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques' });
  }
});

// Lister les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, CONCAT(IFNULL(first_name,\'\'), \' \', IFNULL(last_name,\'\')) as name, first_name, last_name, email, phone, role, wallet_balance, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Créditer le portefeuille d'un utilisateur
router.put('/users/:id/wallet', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Montant invalide' });
        }

        const user = await db.query('SELECT id, wallet_balance FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        await db.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [Number(amount), id]);

        await db.query(
            'INSERT INTO transactions (user_id, amount, type, status, payment_method, medicament_search) VALUES (?, ?, ?, ?, ?, ?)',
            [id, Number(amount), 'topup', 'completed', 'admin', reason || 'Crédit admin']
        );

        const updated = await db.query('SELECT wallet_balance FROM users WHERE id = ?', [id]);

        res.json({ success: true, new_balance: updated[0].wallet_balance });
    } catch (error) {
        console.error('Admin wallet credit error:', error);
        res.status(500).json({ error: 'Erreur lors du crédit du portefeuille' });
    }
});

// Supprimer un utilisateur (avec nettoyage des FK)
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.query('SELECT role FROM users WHERE id = ?', [id]);
        if (user.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        if (user[0].role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin' });

        // Supprimer les dépendances FK dans l'ordre
        await db.query('DELETE FROM search_sessions WHERE transaction_id IN (SELECT id FROM transactions WHERE user_id = ?)', [id]);
        await db.query('DELETE FROM transactions WHERE user_id = ?', [id]);
        await db.query('DELETE FROM notifications WHERE user_id = ?', [id]);
        await db.query('DELETE FROM user_tokens WHERE user_id = ?', [id]);
        await db.query('DELETE FROM user_locations WHERE user_id = ?', [id]);
        await db.query('DELETE FROM support_tickets WHERE user_id = ?', [id]);
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Erreur suppression utilisateur' });
    }
});

// Lister toutes les transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await db.query(`
      SELECT t.*, CONCAT(IFNULL(u.first_name,''), ' ', IFNULL(u.last_name,'')) as user_name, u.phone as user_phone 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `);
    res.json(transactions);
  } catch (error) {
    console.error('Admin transactions error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions' });
  }
});

// --- GESTION DU SUPPORT ---

// Lister les tickets
router.get('/support', async (req, res) => {
    try {
        const tickets = await db.query(`
            SELECT s.*, u.first_name, u.last_name, u.phone, u.email
            FROM support_tickets s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        res.json(tickets);
    } catch (error) {
        console.error('Support fetch error:', error);
        res.status(500).json({ error: 'Erreur support' });
    }
});

// Mettre à jour un ticket
router.put('/support/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE support_tickets SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur update ticket' });
    }
});

// --- GESTION DU CATALOGUE (ADMIN) ---

// Modifier un médicament
router.put('/medicaments/:id', async (req, res) => {
    const { name, generic_name, category, dosage } = req.body;
    try {
        await db.query(
            'UPDATE medicaments SET name = ?, generic_name = ?, category = ?, dosage = ? WHERE id = ?',
            [name, generic_name, category, dosage, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur modification médicament' });
    }
});

// Supprimer un médicament
router.delete('/medicaments/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM medicaments WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur suppression médicament' });
    }
});

// --- GESTION DES VERSEMENTS (PAYOUTS) ---

// Lister les versements
router.get('/payouts', async (req, res) => {
    try {
        const payouts = await db.query(`
            SELECT p.*, ph.name as pharmacy_name, ph.phone as pharmacy_phone
            FROM payouts p
            JOIN pharmacies ph ON p.pharmacy_id = ph.id
            ORDER BY p.created_at DESC
        `);
        res.json(payouts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur payouts' });
    }
});

// Créer un versement
router.post('/payouts', async (req, res) => {
    const { pharmacy_id, amount, period } = req.body;
    const reference = `PAY-${Date.now()}`;
    try {
        await db.query(
            'INSERT INTO payouts (pharmacy_id, amount, period, reference, status) VALUES (?, ?, ?, ?, "pending")',
            [pharmacy_id, amount, period, reference]
        );
        res.json({ success: true, reference });
    } catch (error) {
        res.status(500).json({ error: 'Erreur creation payout' });
    }
});

// Valider un versement (Marquer comme terminé)
router.put('/payouts/:id', async (req, res) => {
    const { status } = req.body; // usually 'completed'
    try {
        await db.query('UPDATE payouts SET status = ?, updated_at = NOW() WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur validation payout' });
    }
});

// --- CONFIGURATION SYSTÈME ---

// Récupérer la config (On simule une table settings ou on utilise des constantes pour le moment)
router.get('/config', async (req, res) => {
    try {
        // Dans une vraie app, on lirait une table 'settings'
        // Ici on renvoie des valeurs par défaut pour la démo
        res.json({
            search_fee: 300,
            commission_percent: 10,
            low_stock_threshold: 50,
            maintenance_mode: false
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur config' });
    }
});

// Mettre à jour la config
router.put('/config', async (req, res) => {
    const { search_fee, commission_percent } = req.body;
    try {
        // On pourrait stocker ça en DB
        res.json({ success: true, message: 'Configuration mise à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur update config' });
    }
});

module.exports = router;

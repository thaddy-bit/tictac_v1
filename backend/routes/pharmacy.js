const express = require('express');
const router = express.Router();
const db = require('../config/database');
const pharmacyAuth = require('../middleware/pharmacyAuth');

// Toutes les routes ici nécessitent d'être une pharmacie (ou admin)
router.use(pharmacyAuth);

// Récupérer l'ID de la pharmacie associée à l'utilisateur connecté
async function getPharmacyId(userId) {
  const result = await db.query(
    'SELECT id FROM pharmacies WHERE user_id = ?',
    [userId]
  );
  return result[0]?.id;
}

// Obtenir l'inventaire complet de la pharmacie connectée
router.get('/inventory', async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    if (!pharmacyId) return res.status(403).json({ error: 'Aucune pharmacie associée à ce compte' });

    const inventory = await db.query(
      `SELECT s.id, s.medicament_id, s.quantity, s.price, s.last_updated,
              m.name, m.generic_name, m.category, m.dosage
       FROM stocks s
       JOIN medicaments m ON s.medicament_id = m.id
       WHERE s.pharmacy_id = ?
       ORDER BY m.name ASC`,
      [pharmacyId]
    );

    res.json(inventory);
  } catch (error) {
    console.error('Pharmacy inventory error:', error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'inventaire" });
  }
});

// Ajouter un médicament à l'inventaire
router.post('/inventory', async (req, res) => {
  try {
    const { medicament_id, quantity, price } = req.body;
    const pharmacyId = await getPharmacyId(req.user.id);
    if (!pharmacyId) return res.status(403).json({ error: 'Aucune pharmacie associée' });

    // Vérifier si déjà présent
    const existing = await db.query(
      'SELECT id FROM stocks WHERE pharmacy_id = ? AND medicament_id = ?',
      [pharmacyId, medicament_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE stocks SET quantity = quantity + ?, price = ?, last_updated = NOW() WHERE id = ?',
        [quantity, price, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO stocks (pharmacy_id, medicament_id, quantity, price, last_updated) VALUES (?, ?, ?, ?, NOW())',
        [pharmacyId, medicament_id, quantity, price]
      );
    }

    res.json({ success: true, message: 'Stock mis à jour' });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ error: "Erreur lors de l'ajout au stock" });
  }
});

// Mettre à jour un item spécifique du stock
router.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;
    const pharmacyId = await getPharmacyId(req.user.id);

    // Vérifier que cet item appartient bien à cette pharmacie
    const item = await db.query(
      'SELECT id FROM stocks WHERE id = ? AND pharmacy_id = ?',
      [id, pharmacyId]
    );

    if (item.length === 0) {
      return res.status(403).json({ error: 'Accès refusé à cet item' });
    }

    await db.query(
      'UPDATE stocks SET quantity = ?, price = ?, last_updated = NOW() WHERE id = ?',
      [quantity, price, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Supprimer un item de l'inventaire
router.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pharmacyId = await getPharmacyId(req.user.id);

        await db.query(
            'DELETE FROM stocks WHERE id = ? AND pharmacy_id = ?',
            [id, pharmacyId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({ error: 'Erreur suppression' });
    }
});

// Stats pour le petit dashboard pharmacie
router.get('/stats', async (req, res) => {
  try {
    const pharmacyId = await getPharmacyId(req.user.id);
    if (!pharmacyId) return res.status(403).json({ error: 'Aucune pharmacie associée' });

    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(quantity) as total_units,
        SUM(quantity * price) as estimated_value
      FROM stocks 
      WHERE pharmacy_id = ?`,
      [pharmacyId]
    );

    res.json(stats[0]);
  } catch (error) {
    console.error('Pharmacy stats error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des stats' });
  }
});

// Créer un nouveau médicament dans le catalogue global
router.post('/medicaments/create', async (req, res) => {
    const { name, generic_name, category, dosage, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO medicaments (name, generic_name, category, dosage, description) VALUES (?, ?, ?, ?, ?)',
            [name, generic_name, category, dosage, description]
        );
        res.json({ success: true, medicament_id: result.insertId });
    } catch (error) {
        console.error('Medication creation error:', error);
        res.status(500).json({ error: 'Erreur création médicament' });
    }
});

module.exports = router;

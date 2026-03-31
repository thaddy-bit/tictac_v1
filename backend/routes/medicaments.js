const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Lister tous les médicaments (pour référence)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || req.query.q || '';

    let whereClause = '';
    let queryParams = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR generic_name LIKE ? OR description LIKE ?';
      queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const medicaments = await db.query(
      `SELECT id, name, description, generic_name, manufacturer, category, dosage, side_effects, interactions, image_url 
       FROM medicaments 
       ${whereClause}
       ORDER BY name ASC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const totalCount = await db.query(
      `SELECT COUNT(*) as count FROM medicaments ${whereClause}`,
      queryParams
    );

    res.json({
      medicaments,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalCount[0].count / limit),
        total_items: totalCount[0].count,
        items_per_page: limit
      }
    });

  } catch (error) {
    console.error('Get medicaments error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des médicaments' });
  }
});

// Obtenir les détails d'un médicament spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medicament = await db.query(
      'SELECT * FROM medicaments WHERE id = ?',
      [id]
    );

    if (medicament.length === 0) {
      return res.status(404).json({ error: 'Médicament non trouvé' });
    }

    res.json({
      medicament: medicament[0]
    });

  } catch (error) {
    console.error('Get medicament error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du médicament' });
  }
});

// Obtenir les catégories de médicaments
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await db.query(
      'SELECT DISTINCT category FROM medicaments WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      categories: categories.map(cat => cat.category)
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

module.exports = router;

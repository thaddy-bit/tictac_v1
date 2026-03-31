const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lister toutes les pharmacies actives
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const city = req.query.city || '';
    const search = req.query.search || '';

    let whereClause = 'WHERE is_active = TRUE';
    let queryParams = [];

    if (city) {
      whereClause += ' AND city LIKE ?';
      queryParams.push(`%${city}%`);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR address LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const pharmacies = await db.query(
      `SELECT id, name, address, phone, email, city, latitude, longitude, rating, estimated_delivery_time, image_url 
       FROM pharmacies 
       ${whereClause}
       ORDER BY name ASC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const totalCount = await db.query(
      `SELECT COUNT(*) as count FROM pharmacies ${whereClause}`,
      queryParams
    );

    res.json({
      pharmacies,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalCount[0].count / limit),
        total_items: totalCount[0].count,
        items_per_page: limit
      }
    });

  } catch (error) {
    console.error('Get pharmacies error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des pharmacies' });
  }
});

// Obtenir les détails d'une pharmacie spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacy = await db.query(
      'SELECT * FROM pharmacies WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ error: 'Pharmacie non trouvée' });
    }

    // Obtenir les médicaments disponibles dans cette pharmacie
    const stocks = await db.query(
      `SELECT 
        m.id, m.name, m.description, m.generic_name, m.manufacturer, m.category,
        s.quantity, s.price, s.last_updated
       FROM stocks s
       JOIN medicaments m ON s.medicament_id = m.id
       WHERE s.pharmacy_id = ? AND s.quantity > 0
       ORDER BY m.name ASC`,
      [id]
    );

    res.json({
      pharmacy: pharmacy[0],
      stocks,
      total_products: stocks.length
    });

  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la pharmacie' });
  }
});

// Obtenir les villes disponibles
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await db.query(
      'SELECT DISTINCT city FROM pharmacies WHERE city IS NOT NULL AND is_active = TRUE ORDER BY city'
    );

    res.json({
      cities: cities.map(city => city.city)
    });

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des villes' });
  }
});

// Obtenir les statistiques d'une pharmacie (pour les partenaires)
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la pharmacie existe
    const pharmacy = await db.query(
      'SELECT * FROM pharmacies WHERE id = ?',
      [id]
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ error: 'Pharmacie non trouvée' });
    }

    // Statistiques des stocks
    const stockStats = await db.query(
      `SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN quantity > 0 THEN 1 ELSE 0 END) as available_products,
        SUM(quantity) as total_quantity,
        AVG(price) as avg_price
       FROM stocks WHERE pharmacy_id = ?`,
      [id]
    );

    // Top 10 médicaments les plus chers
    const expensiveProducts = await db.query(
      `SELECT 
        m.name, s.price, s.quantity
       FROM stocks s
       JOIN medicaments m ON s.medicament_id = m.id
       WHERE s.pharmacy_id = ? AND s.quantity > 0
       ORDER BY s.price DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      pharmacy_id: id,
      stats: stockStats[0],
      expensive_products: expensiveProducts
    });

  } catch (error) {
    console.error('Get pharmacy stats error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;

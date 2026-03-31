const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');
const logs = require('../config/logger');

// Calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
}

// Obtenir les pharmacies les plus proches
router.post('/nearby', auth, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide'),
  body('radius').optional().isInt({ min: 1, max: 50 }).withMessage('Le rayon doit être entre 1 et 50 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logs.error('Geolocation validation errors', { errors: errors.array(), userId: req.user.id });
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, radius = 10 } = req.body;
    const userId = req.user.id;

    logs.info('Nearby pharmacies search', { userId, latitude, longitude, radius });

    // Recherche des pharmacies les plus proches directement en SQL (Formule de Haversine)
    // 6371 est le rayon de la Terre en km
    const query = `
      SELECT id, name, address, city, phone, email, latitude, longitude, neighborhood, schedule,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM pharmacies
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND is_active = TRUE
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT 20
    `;

    const nearbyPharmacies = await db.query(query, [latitude, longitude, latitude, radius]);

    // Ajouter les informations de stock pour toutes les pharmacies en une seule requête (Optimisation SQL-02)
    const pharmacyIds = nearbyPharmacies.map(p => p.id);
    let allStocks = [];
    if (pharmacyIds.length > 0) {
      allStocks = await db.query(
        `SELECT s.pharmacy_id, m.name as medicament_name, s.quantity, s.price
         FROM stocks s
         JOIN medicaments m ON s.medicament_id = m.id
         WHERE s.pharmacy_id IN (?) AND s.quantity > 0
         ORDER BY s.quantity DESC`,
        [pharmacyIds]
      );
    }

    // Associer les stocks aux pharmacies
    nearbyPharmacies.forEach(pharmacy => {
      pharmacy.distance = Math.round(pharmacy.distance * 100) / 100;
      pharmacy.available_medicaments = allStocks
        .filter(s => s.pharmacy_id === pharmacy.id)
        .slice(0, 5); // Garder les 5 plus pertinents
    });

    logs.info('Nearby pharmacies found', { 
      userId, 
      count: nearbyPharmacies.length,
      radius 
    });

    res.json({
      success: true,
      user_location: { latitude, longitude },
      radius,
      total_found: nearbyPharmacies.length,
      pharmacies: nearbyPharmacies
    });

  } catch (error) {
    logs.error('Geolocation search error', { 
      error: error.message, 
      stack: error.stack, 
      userId: req.user.id 
    });
    res.status(500).json({ error: 'Erreur lors de la recherche géolocalisée' });
  }
});

// Obtenir l'itinéraire vers une pharmacie
router.get('/directions/:pharmacyId', auth, async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { from_lat, from_lon } = req.query;
    
    if (!from_lat || !from_lon) {
      return res.status(400).json({ error: 'Coordonnées de départ requises' });
    }

    // Récupérer les coordonnées de la pharmacie
    const pharmacy = await db.query(
      'SELECT name, address, latitude, longitude FROM pharmacies WHERE id = ?',
      [pharmacyId]
    );

    if (pharmacy.length === 0) {
      return res.status(404).json({ error: 'Pharmacie non trouvée' });
    }

    const pharmacyData = pharmacy[0];
    const distance = calculateDistance(
      parseFloat(from_lat), parseFloat(from_lon),
      pharmacyData.latitude, pharmacyData.longitude
    );

    // Générer un lien Google Maps pour l'itinéraire
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${from_lat},${from_lon}&destination=${pharmacyData.latitude},${pharmacyData.longitude}`;

    logs.info('Directions requested', { 
      userId: req.user.id,
      pharmacyId,
      distance: Math.round(distance * 100) / 100
    });

    res.json({
      success: true,
      pharmacy: {
        name: pharmacyData.name,
        address: pharmacyData.address,
        latitude: pharmacyData.latitude,
        longitude: pharmacyData.longitude
      },
      distance: Math.round(distance * 100) / 100,
      google_maps_url: googleMapsUrl,
      walking_time: Math.round(distance * 12), // ~12 minutes par km à pied
      driving_time: Math.round(distance * 3) // ~3 minutes par km en voiture
    });

  } catch (error) {
    logs.error('Directions error', { 
      error: error.message, 
      stack: error.stack, 
      userId: req.user.id 
    });
    res.status(500).json({ error: 'Erreur lors de la génération de l\'itinéraire' });
  }
});

// Mettre à jour la position de l'utilisateur
router.post('/update-location', auth, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    // Mettre à jour ou insérer la position de l'utilisateur
    await db.query(
      `INSERT INTO user_locations (user_id, latitude, longitude, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, updated_at = NOW()`,
      [userId, latitude, longitude, latitude, longitude]
    );

    logs.info('User location updated', { userId, latitude, longitude });

    res.json({
      success: true,
      message: 'Position mise à jour avec succès'
    });

  } catch (error) {
    logs.error('Location update error', { 
      error: error.message, 
      stack: error.stack, 
      userId: req.user.id 
    });
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la position' });
  }
});

// Obtenir la dernière position enregistrée de l'utilisateur
router.get('/my-location', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const location = await db.query(
      'SELECT latitude, longitude, updated_at FROM user_locations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );

    if (location.length === 0) {
      return res.json({
        success: true,
        location: null,
        message: 'Aucune position enregistrée'
      });
    }

    res.json({
      success: true,
      location: {
        latitude: location[0].latitude,
        longitude: location[0].longitude,
        updated_at: location[0].updated_at
      }
    });

  } catch (error) {
    logs.error('Get user location error', { 
      error: error.message, 
      stack: error.stack, 
      userId: req.user.id 
    });
    res.status(500).json({ error: 'Erreur lors de la récupération de la position' });
  }
});

module.exports = router;

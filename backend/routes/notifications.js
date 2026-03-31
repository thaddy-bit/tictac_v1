const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');
const logs = require('../config/logger');

// Enregistrer un token de notification push
router.post('/register-token', auth, [
  body('token').notEmpty().withMessage('Le token est requis'),
  body('device_info').optional().isObject().withMessage('Les infos appareil doivent être un objet')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, device_info = {} } = req.body;
    const userId = req.user.id;

    await notificationService.registerToken(userId, token, device_info);

    res.json({
      success: true,
      message: 'Token enregistré avec succès'
    });

  } catch (error) {
    logs.error('Token registration error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du token' });
  }
});

// Désenregistrer un token
router.post('/unregister-token', auth, [
  body('token').notEmpty().withMessage('Le token est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    const userId = req.user.id;

    await notificationService.unregisterToken(userId, token);

    res.json({
      success: true,
      message: 'Token désenregistré avec succès'
    });

  } catch (error) {
    logs.error('Token unregistration error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors du désenregistrement du token' });
  }
});

// Obtenir les notifications non lues
router.get('/unread', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const userId = req.user.id;

    const notifications = await notificationService.getUnreadNotifications(userId, parseInt(limit));

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });

  } catch (error) {
    logs.error('Get unread notifications error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Marquer une notification comme lue
router.put('/read/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await notificationService.markAsRead(userId, parseInt(notificationId));

    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });

  } catch (error) {
    logs.error('Mark notification as read error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors du marquage de la notification' });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });

  } catch (error) {
    logs.error('Mark all notifications as read error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors du marquage des notifications' });
  }
});

// Envoyer une notification de test (admin seulement)
router.post('/test', auth, [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('message').notEmpty().withMessage('Le message est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message } = req.body;
    const userId = req.user.id;

    const result = await notificationService.sendNotification(userId, title, message);

    res.json({
      success: result.success,
      message: result.success ? 'Notification de test envoyée' : 'Échec de l\'envoi',
      details: result
    });

  } catch (error) {
    logs.error('Test notification error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification de test' });
  }
});

// Obtenir l'historique des notifications
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await db.query(
      `SELECT id, title, message, type, is_read, data, created_at
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    const total = await db.query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      notifications: notifications.map(n => {
        let parsedData = {};
        try {
          parsedData = JSON.parse(n.data || '{}');
        } catch (e) {
          console.error('Error parsing notification data:', e);
        }
        return {
          ...n,
          data: parsedData
        };
      }),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].total,
        pages: Math.ceil(total[0].total / parseInt(limit))
      }
    });

  } catch (error) {
    logs.error('Get notification history error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
});

// Statistiques des notifications
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read_count,
        SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week
       FROM notifications 
       WHERE user_id = ?`,
      [userId]
    );

    const typeStats = await db.query(
      `SELECT type, COUNT(*) as count
       FROM notifications 
       WHERE user_id = ? 
       GROUP BY type`,
      [userId]
    );

    res.json({
      success: true,
      stats: stats[0],
      by_type: typeStats
    });

  } catch (error) {
    logs.error('Get notification stats error', { error: error.message, userId: req.user.id });
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;

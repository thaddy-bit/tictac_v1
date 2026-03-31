const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');
const logs = require('../config/logger');

// Créer un nouveau ticket de support
router.post('/', auth, [
  body('subject').notEmpty().withMessage('Le sujet est requis'),
  body('message').notEmpty().withMessage('Le message est requis'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message, priority = 'medium' } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO support_tickets (user_id, subject, message, priority, status) VALUES (?, ?, ?, ?, ?)',
      [userId, subject, message, priority, 'open']
    );

    res.status(201).json({
      message: 'Ticket créé avec succès',
      ticket_id: result.insertId,
      status: 'open'
    });

    logs.info('🎫 New support ticket created', { ticketId: result.insertId, userId, subject });

  } catch (error) {
    logs.error('Ticket creation error', { error: error.message });
    res.status(500).json({ error: 'Erreur lors de la création du ticket' });
  }
});

// Lister les tickets de l'utilisateur connecté
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await db.query(
      'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ tickets });

  } catch (error) {
    logs.error('Get tickets error', { error: error.message });
    res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
  }
});

// Obtenir les détails d'un ticket
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ticket = await db.query(
      'SELECT * FROM support_tickets WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (ticket.length === 0) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }

    res.json({ ticket: ticket[0] });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du ticket' });
  }
});

module.exports = router;

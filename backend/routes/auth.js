const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logs = require('../config/logger');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24h (matches JWT_EXPIRES_IN)
};

// Inscription d'un nouvel utilisateur
router.post('/register', [
  body('phone')
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis')
    .matches(/^\+242\d{9}$/)
    .withMessage('Numéro de téléphone congolais invalide (format: +242XXXXXXXXX)'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('first_name').optional().trim().isLength({ min: 2 }),
  body('last_name').optional().trim().isLength({ min: 2 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logs.auth.failed(req.body.phone, 'Validation errors', req.ip);
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password, first_name, last_name, email, city } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existingUser.length > 0) {
      logs.auth.failed(phone, 'Phone already exists', req.ip);
      return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const result = await db.query(
      'INSERT INTO users (phone, email, first_name, last_name, city, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [phone, email || null, first_name || null, last_name || null, city || null, password_hash]
    );

    // Générer le token JWT
    const token = jwt.sign(
      { id: result.insertId, phone, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: result.insertId,
        phone,
        email,
        first_name,
        last_name,
        city,
        wallet_balance: 0.00
      }
    });

    // Logger l'inscription réussie
    logs.auth.register(result.insertId, phone, req.ip);

  } catch (error) {
    logs.error('Registration error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Connexion d'un utilisateur
router.post('/login', [
  body('phone')
    .notEmpty()
    .withMessage('Le numéro de téléphone est requis')
    .matches(/^\+242\d{9}$/)
    .withMessage('Numéro de téléphone congolais invalide (format: +242XXXXXXXXX)'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logs.auth.failed(req.body.phone, 'Login validation errors', req.ip);
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password } = req.body;

    // Trouver l'utilisateur
    const user = await db.query(
      'SELECT id, phone, email, first_name, last_name, city, role, wallet_balance, password_hash FROM users WHERE phone = ?',
      [phone]
    );

    if (user.length === 0) {
      logs.auth.failed(phone, 'User not found', req.ip);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user[0].password_hash);
    if (!isValidPassword) {
      logs.auth.failed(phone, 'Invalid password', req.ip);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user[0].id, phone: user[0].phone, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user[0].id,
        phone: user[0].phone,
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        city: user[0].city,
        role: user[0].role,
        wallet_balance: user[0].wallet_balance
      }
    });

    // Logger la connexion réussie
    logs.auth.login(user[0].id, phone, req.ip);

  } catch (error) {
    logs.error('Login error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Vérifier le token
router.get('/verify', async (req, res) => {
  try {
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const cookieToken = req.cookies?.token;
    const token = headerToken || cookieToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer les informations de l'utilisateur avec son rôle
    const user = await db.query(
      'SELECT id, phone, email, first_name, last_name, city, role, wallet_balance FROM users WHERE id = ?',
      [decoded.id]
    );

    if (user.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      valid: true,
      user: user[0]
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// Déconnexion
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

const FORGOT_PASSWORD_MSG =
  'Si ce numéro correspond à un compte client, vous pouvez définir un nouveau mot de passe à l’étape suivante.';

// Mot de passe oublié — réservé aux comptes rôle « user » (clients)
router.post(
  '/forgot-password',
  [
    body('phone')
      .notEmpty()
      .withMessage('Le numéro de téléphone est requis')
      .matches(/^\+242\d{9}$/)
      .withMessage('Numéro de téléphone congolais invalide (format: +242XXXXXXXXX)'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { phone } = req.body;
      const rows = await db.query("SELECT id FROM users WHERE phone = ? AND role = 'user'", [phone]);

      if (rows.length === 0) {
        return res.json({ message: FORGOT_PASSWORD_MSG });
      }

      const resetToken = jwt.sign(
        { uid: rows[0].id, pwdReset: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      logs.info('Password reset token issued', { userId: rows[0].id, ip: req.ip });

      return res.json({
        message: FORGOT_PASSWORD_MSG,
        resetToken,
      });
    } catch (error) {
      logs.error('Forgot password error', { error: error.message });
      res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
    }
  }
);

// Définir un nouveau mot de passe avec le jeton de réinitialisation
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Jeton requis'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let decoded;
      try {
        decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          return res.status(400).json({ error: 'Ce lien de réinitialisation a expiré. Refaites une demande.' });
        }
        return res.status(400).json({ error: 'Jeton de réinitialisation invalide' });
      }

      if (!decoded.pwdReset || !decoded.uid) {
        return res.status(400).json({ error: 'Jeton de réinitialisation invalide' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(req.body.password, salt);

      const result = await db.query(
        "UPDATE users SET password_hash = ? WHERE id = ? AND role = 'user'",
        [password_hash, decoded.uid]
      );

      const affected = result && typeof result.affectedRows === 'number' ? result.affectedRows : 0;
      if (affected === 0) {
        return res.status(400).json({ error: 'Impossible de mettre à jour ce compte' });
      }

      logs.info('Password reset completed', { userId: decoded.uid, ip: req.ip });
      return res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      logs.error('Reset password error', { error: error.message });
      res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
);

module.exports = router;

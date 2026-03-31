const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const headerToken = req.header('Authorization')?.replace('Bearer ', '');
    const cookieToken = req.cookies ? req.cookies.token : null;
    const token = headerToken || cookieToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé - Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // On attache directement les infos du token (id, phone) à la requête
    // Cela évite une requête SQL inutile à chaque appel API
    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      role: decoded.role
    };
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

module.exports = auth;

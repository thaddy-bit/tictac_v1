const jwt = require('jsonwebtoken');

/**
 * Middleware pour authentifier les administrateurs
 */
const adminAuth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const cookieToken = req.cookies ? req.cookies.token : null;
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé : Token manquant' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur est un admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé : Droits administrateur requis' });
    }

    // Attacher les infos au req
    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      role: decoded.role
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = adminAuth;

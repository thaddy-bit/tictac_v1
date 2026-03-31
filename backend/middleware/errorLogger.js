const logs = require('../config/logger');

// Middleware pour logger toutes les erreurs
const errorLogger = (err, req, res, next) => {
  // Logger l'erreur détaillée
  logs.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });
  
  // Envoyer une réponse d'erreur générique au client
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Une erreur interne est survenue',
      code: 'INTERNAL_ERROR'
    });
  } else {
    // En développement, envoyer les détails de l'erreur
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      code: 'INTERNAL_ERROR'
    });
  }
};

module.exports = errorLogger;

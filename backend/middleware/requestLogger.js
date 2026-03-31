const logs = require('../config/logger');

// Middleware pour logger toutes les requêtes HTTP
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Logger la requête entrante
  logs.info('Request started', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });
  
  // Intercepter la réponse pour logger les résultats
  const originalSend = res.send;
  res.send = function(data) {
    res.send = originalSend;
    const responseTime = Date.now() - startTime;
    
    // Logger la requête complète
    logs.http(req, res, responseTime);
    
    // Logger les erreurs de réponse
    if (res.statusCode >= 400) {
      logs.error('HTTP Error Response', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userId: req.user?.id || 'anonymous',
        errorData: data
      });
    }
    
    return res.send(data);
  };
  
  next();
};

module.exports = requestLogger;

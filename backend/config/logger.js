const winston = require('winston');
const path = require('path');

// Créer le répertoire logs s'il n'existe pas
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Format console pour le développement
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'tictac-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Fichier de logs général
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Fichier pour les erreurs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Fichier pour les authentifications
    new winston.transports.File({
      filename: path.join(logsDir, 'auth.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Fichier pour les paiements
    new winston.transports.File({
      filename: path.join(logsDir, 'payment.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Fichier pour les requêtes HTTP
    new winston.transports.File({
      filename: path.join(logsDir, 'requests.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    })
  ]
});

// Ajouter console transport en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Méthodes utilitaires pour différents types de logs
const logs = {
  // Logs généraux
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, meta = {}) => logger.error(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // Logs HTTP
  http: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  },
  
  // Logs d'authentification
  auth: {
    login: (userId, phone, ip) => {
      logger.info('User Login', {
        type: 'auth_login',
        userId,
        phone,
        ip,
        timestamp: new Date().toISOString()
      }, { filename: 'auth.log' });
    },
    
    register: (userId, phone, ip) => {
      logger.info('User Registration', {
        type: 'auth_register',
        userId,
        phone,
        ip,
        timestamp: new Date().toISOString()
      }, { filename: 'auth.log' });
    },
    
    logout: (userId, ip) => {
      logger.info('User Logout', {
        type: 'auth_logout',
        userId,
        ip,
        timestamp: new Date().toISOString()
      }, { filename: 'auth.log' });
    },
    
    failed: (phone, reason, ip) => {
      logger.warn('Authentication Failed', {
        type: 'auth_failed',
        phone,
        reason,
        ip,
        timestamp: new Date().toISOString()
      }, { filename: 'auth.log' });
    }
  },
  
  // Logs de paiement
  payment: {
    initiated: (transactionId, userId, phone, amount, medicament) => {
      logger.info('Payment Initiated', {
        type: 'payment_initiated',
        transactionId,
        userId,
        phone,
        amount,
        medicament,
        timestamp: new Date().toISOString()
      }, { filename: 'payment.log' });
    },
    
    completed: (transactionId, userId, amount) => {
      logger.info('Payment Completed', {
        type: 'payment_completed',
        transactionId,
        userId,
        amount,
        timestamp: new Date().toISOString()
      }, { filename: 'payment.log' });
    },
    
    failed: (transactionId, userId, reason) => {
      logger.error('Payment Failed', {
        type: 'payment_failed',
        transactionId,
        userId,
        reason,
        timestamp: new Date().toISOString()
      }, { filename: 'payment.log' });
    },
    
    refunded: (transactionId, userId, amount) => {
      logger.info('Payment Refunded', {
        type: 'payment_refunded',
        transactionId,
        userId,
        amount,
        timestamp: new Date().toISOString()
      }, { filename: 'payment.log' });
    }
  },
  
  // Logs de base de données
  database: {
    query: (sql, params, duration) => {
      logger.debug('Database Query', {
        type: 'db_query',
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        params: params ? JSON.stringify(params).substring(0, 100) : null,
        duration: `${duration}ms`
      });
    },
    
    error: (sql, error) => {
      logger.error('Database Error', {
        type: 'db_error',
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        error: error.message,
        stack: error.stack
      });
    }
  },
  
  // Logs de recherche
  search: {
    query: (userId, query, resultsCount) => {
      logger.info('Search Query', {
        type: 'search_query',
        userId,
        query,
        resultsCount,
        timestamp: new Date().toISOString()
      });
    },
    
    noResults: (userId, query) => {
      logger.warn('Search No Results', {
        type: 'search_no_results',
        userId,
        query,
        timestamp: new Date().toISOString()
      });
    }
  }
};

module.exports = logs;

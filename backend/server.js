const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import des middlewares de logs
const requestLogger = require('./middleware/requestLogger');
const errorLogger = require('./middleware/errorLogger');
const logs = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (must be BEFORE helmet to handle preflight OPTIONS)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
  : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8083'];

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Helmet after CORS so preflight requests get proper headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(express.json());
app.use(cookieParser());

// Logger toutes les requêtes HTTP
app.use(requestLogger);

// Rate limiting (Increased for monitoring dashboards)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000 // limit each IP to 2000 requests per windowMs
});
app.use('/api/', limiter);

const adminAuth = require('./middleware/adminAuth');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicaments', require('./routes/medicaments'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/search', require('./routes/search'));
app.use('/api/geolocation', require('./routes/geolocation'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/logs', adminAuth, require('./routes/logs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/support', require('./routes/support'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/monitoring', adminAuth, require('./scripts/monitoring_simple'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorLogger);

// 404 handler
app.use('*', (req, res) => {
  logs.warn('Route not found', { url: req.originalUrl, method: req.method, ip: req.ip });
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  logs.info(`Tictac Backend server started`, { port: PORT, environment: process.env.NODE_ENV });
  console.log(`Tictac Backend server running on port ${PORT} at 0.0.0.0`);
});
 
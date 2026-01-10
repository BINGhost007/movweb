const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import configurations and middleware
const connectDB = require('./config/database');
const { authenticate, logRequest } = require('./middleware/auth');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const adminRoutes = require('./routes/admin');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.ADMIN_URL || 'http://localhost:3001'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// Specific rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(logRequest);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/admin', adminRoutes);

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    success: true,
    message: 'Movie Streaming Platform API Documentation',
    version: '1.0.0',
    endpoints: {
      authentication: {
        'POST /api/v1/auth/register': 'Register new user',
        'POST /api/v1/auth/login': 'Login user',
        'POST /api/v1/auth/refresh-token': 'Refresh JWT token',
        'POST /api/v1/auth/logout': 'Logout user',
        'GET /api/v1/auth/profile': 'Get user profile',
        'PUT /api/v1/auth/profile': 'Update user profile',
        'PUT /api/v1/auth/change-password': 'Change password',
        'POST /api/v1/auth/forgot-password': 'Request password reset',
        'POST /api/v1/auth/reset-password': 'Reset password'
      },
      movies: {
        'GET /api/v1/movies/popular': 'Get popular movies',
        'GET /api/v1/movies/all': 'Get all movies with filters',
        'GET /api/v1/movies/search': 'Search movies',
        'GET /api/v1/movies/:id': 'Get movie details',
        'GET /api/v1/movies/recommendations': 'Get personalized recommendations',
        'POST /api/v1/movies/:id/stream': 'Stream movie (requires subscription)',
        'POST /api/v1/movies/:id/download': 'Download movie (premium feature)',
        'POST /api/v1/movies/:id/progress': 'Update viewing progress'
      },
      admin: {
        'GET /api/v1/admin/dashboard': 'Get admin dashboard data',
        'GET /api/v1/admin/analytics': 'Get platform analytics',
        'GET /api/v1/admin/movies': 'Get all movies (admin view)',
        'POST /api/v1/admin/movies': 'Create new movie',
        'PUT /api/v1/admin/movies/:id': 'Update movie',
        'DELETE /api/v1/admin/movies/:id': 'Delete movie',
        'PATCH /api/v1/admin/movies/:id/status': 'Update movie status',
        'GET /api/v1/admin/users': 'Get all users',
        'PATCH /api/v1/admin/users/:id/subscription': 'Update user subscription',
        'PATCH /api/v1/admin/users/:id/status': 'Activate/deactivate user',
        'GET /api/v1/admin/reviews': 'Get all reviews',
        'PATCH /api/v1/admin/reviews/:id/moderate': 'Moderate review',
        'POST /api/v1/admin/movies/bulk-import': 'Bulk import movies'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      tokenExpiry: '30 days'
    },
    rateLimits: {
      general: '100 requests per 15 minutes',
      authentication: '5 requests per 15 minutes'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}`
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
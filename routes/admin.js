const express = require('express');
const { body, query, param } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard routes
router.get('/dashboard', authenticate, requireAdmin, adminController.getDashboard);
router.get('/analytics', authenticate, requireAdmin, adminController.getAnalytics);

// Movie management routes
router.get('/movies', 
  authenticate, 
  requireAdmin, 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['draft', 'pending', 'approved', 'rejected', 'archived']).withMessage('Invalid status'),
    query('contentType').optional().isIn(['standard', 'premium', 'exclusive']).withMessage('Invalid content type'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sortBy').optional().isIn(['title', 'createdAt', 'updatedAt', 'releaseDate', 'statistics.viewCount', 'statistics.averageRating']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
  ],
  adminController.getAllMoviesAdmin
);

router.post('/movies',
  authenticate,
  requireAdmin,
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
    body('overview').trim().isLength({ min: 10 }).withMessage('Overview must be at least 10 characters'),
    body('releaseDate').isISO8601().withMessage('Release date must be a valid date'),
    body('runtime').isInt({ min: 1 }).withMessage('Runtime must be a positive integer'),
    body('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
    body('contentRating').optional().isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated']).withMessage('Invalid content rating')
  ],
  adminController.upload,
  adminController.createMovie
);

router.put('/movies/:id',
  authenticate,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid movie ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
    body('overview').optional().trim().isLength({ min: 10 }).withMessage('Overview must be at least 10 characters'),
    body('runtime').optional().isInt({ min: 1 }).withMessage('Runtime must be a positive integer'),
    body('genres').optional().isArray({ min: 1 }).withMessage('At least one genre is required')
  ],
  adminController.updateMovie
);

router.delete('/movies/:id',
  authenticate,
  requireAdmin,
  [param('id').isMongoId().withMessage('Invalid movie ID')],
  adminController.deleteMovie
);

router.patch('/movies/:id/status',
  authenticate,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid movie ID'),
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
    body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
  ],
  adminController.updateMovieStatus
);

// User management routes
router.get('/users',
  authenticate,
  requireAdmin,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('subscriptionPlan').optional().isIn(['free', 'basic', 'premium', 'family']).withMessage('Invalid subscription plan'),
    query('subscriptionStatus').optional().isIn(['active', 'cancelled', 'expired', 'trial']).withMessage('Invalid subscription status')
  ],
  adminController.getAllUsers
);

router.patch('/users/:id/subscription',
  authenticate,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('plan').optional().isIn(['free', 'basic', 'premium', 'family']).withMessage('Invalid subscription plan'),
    body('status').optional().isIn(['active', 'cancelled', 'expired', 'trial']).withMessage('Invalid subscription status'),
    body('autoRenew').optional().isBoolean().withMessage('Auto renew must be a boolean'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date')
  ],
  adminController.updateUserSubscription
);

router.patch('/users/:id/status',
  authenticate,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('isActive').isBoolean().withMessage('Is active must be a boolean')
  ],
  adminController.updateUserStatus
);

// Review management routes
router.get('/reviews',
  authenticate,
  requireAdmin,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'flagged']).withMessage('Invalid moderation status'),
    query('movieId').optional().isMongoId().withMessage('Invalid movie ID'),
    query('search').optional().isString().withMessage('Search must be a string')
  ],
  adminController.getAllReviews
);

router.patch('/reviews/:id/moderate',
  authenticate,
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('moderationStatus').isIn(['pending', 'approved', 'rejected', 'flagged']).withMessage('Invalid moderation status'),
    body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
  ],
  adminController.moderateReview
);

// Bulk operations
router.post('/movies/bulk-import',
  authenticate,
  requireAdmin,
  [
    body('movies').isArray({ min: 1, max: 100 }).withMessage('Movies array must contain between 1 and 100 items')
  ],
  adminController.bulkImportMovies
);

module.exports = router;
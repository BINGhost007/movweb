const express = require('express');
const { body, query, param } = require('express-validator');
const movieController = require('../controllers/movieController');
const { authenticate, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const streamMovieValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid movie ID')
];

const updateProgressValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid movie ID'),
  body('position')
    .isNumeric()
    .withMessage('Position must be a number'),
  body('progress')
    .isNumeric()
    .min(0)
    .max(100)
    .withMessage('Progress must be between 0 and 100'),
  body('duration')
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('quality')
    .optional()
    .isIn(['480p', '720p', '1080p', '4k'])
    .withMessage('Invalid video quality')
];

const searchMoviesValidation = [
  query('query')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string'),
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Year must be a valid year'),
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Minimum rating must be between 0 and 10')
];

// Public routes (no authentication required)
router.get('/popular', movieController.getPopularMovies);
router.get('/all', movieController.getAllMovies);
router.get('/search', searchMoviesValidation, movieController.searchMovies);
router.get('/:id', movieController.getMovieById);

// Protected routes (authentication required)
router.get('/recommendations', authenticate, movieController.getRecommendations);

// Subscription required routes
router.post('/:id/stream', 
  authenticate,
  requireSubscription('basic'),
  streamMovieValidation,
  movieController.streamMovie
);

router.post('/:id/download',
  authenticate,
  requireSubscription('premium'),
  streamMovieValidation,
  movieController.downloadMovie
);

router.post('/:id/progress',
  authenticate,
  updateProgressValidation,
  movieController.updateViewingProgress
);

module.exports = router;
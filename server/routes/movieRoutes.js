const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getMovies,
  getPopularMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getRelatedMovies,
  incrementDownload
} = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/popular', getPopularMovies);
router.get('/:id', getMovieById);
router.get('/:id/related', getRelatedMovies);
router.post('/:id/download', protect, incrementDownload);

// Admin routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;
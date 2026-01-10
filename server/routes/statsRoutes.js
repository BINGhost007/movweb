const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getStats,
  getMovieStats,
  getActivityStats
} = require('../controllers/statsController');

router.get('/', protect, admin, getStats);
router.get('/movies', protect, admin, getMovieStats);
router.get('/activity', protect, admin, getActivityStats);

module.exports = router;
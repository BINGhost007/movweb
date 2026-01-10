const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist
} = require('../controllers/watchlistController');

router.get('/', protect, getWatchlist);
router.post('/', protect, addToWatchlist);
router.delete('/:id', protect, removeFromWatchlist);
router.get('/check/:movieId', protect, checkWatchlist);

module.exports = router;
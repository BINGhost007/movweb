const asyncHandler = require('express-async-handler');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.find({ user: req.user._id })
    .populate('movie', 'title posterUrl year rating')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: watchlist
  });
});

// @desc    Add to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) {
    res.status(400);
    throw new Error('Please provide movie ID');
  }

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  // Check if already in watchlist
  const existingWatchlist = await Watchlist.findOne({ 
    user: req.user._id, 
    movie: movieId 
  });

  if (existingWatchlist) {
    res.status(400);
    throw new Error('Movie already in watchlist');
  }

  const watchlist = new Watchlist({
    user: req.user._id,
    movie: movieId
  });

  const createdWatchlist = await watchlist.save();

  res.status(201).json({
    success: true,
    data: createdWatchlist
  });
});

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.findById(req.params.id);

  if (watchlist && watchlist.user.toString() === req.user._id.toString()) {
    await watchlist.remove();

    res.json({
      success: true,
      message: 'Removed from watchlist'
    });
  } else {
    res.status(404);
    throw new Error('Watchlist item not found');
  }
});

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
const checkWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const watchlist = await Watchlist.findOne({ 
    user: req.user._id, 
    movie: movieId 
  });

  res.json({
    success: true,
    isInWatchlist: !!watchlist
  });
});

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist
};
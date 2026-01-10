const asyncHandler = require('express-async-handler');
const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate('movie', 'title posterUrl year rating')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: favorites
  });
});

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
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

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({ 
    user: req.user._id, 
    movie: movieId 
  });

  if (existingFavorite) {
    res.status(400);
    throw new Error('Movie already in favorites');
  }

  const favorite = new Favorite({
    user: req.user._id,
    movie: movieId
  });

  const createdFavorite = await favorite.save();

  res.status(201).json({
    success: true,
    data: createdFavorite
  });
});

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findById(req.params.id);

  if (favorite && favorite.user.toString() === req.user._id.toString()) {
    await favorite.remove();

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } else {
    res.status(404);
    throw new Error('Favorite not found');
  }
});

// @desc    Check if movie is in favorites
// @route   GET /api/favorites/check/:movieId
// @access  Private
const checkFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const favorite = await Favorite.findOne({ 
    user: req.user._id, 
    movie: movieId 
  });

  res.json({
    success: true,
    isFavorite: !!favorite
  });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
};
const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  // Movie statistics
  const totalMovies = await Movie.countDocuments();
  const popularMovies = await Movie.countDocuments({ isPopular: true });
  const totalViews = await Movie.aggregate([
    { $group: { _id: null, total: { $sum: "$views" } } }
  ]);
  const totalDownloads = await Movie.aggregate([
    { $group: { _id: null, total: { $sum: "$downloads" } } }
  ]);

  // User statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });

  // Category statistics
  const totalCategories = await Category.countDocuments();

  // Top movies by views
  const topMoviesByViews = await Movie.find()
    .sort({ views: -1 })
    .limit(5)
    .select('title views');

  // Top movies by downloads
  const topMoviesByDownloads = await Movie.find()
    .sort({ downloads: -1 })
    .limit(5)
    .select('title downloads');

  res.json({
    success: true,
    data: {
      movies: {
        total: totalMovies,
        popular: popularMovies,
        views: totalViews[0]?.total || 0,
        downloads: totalDownloads[0]?.total || 0
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        admin: adminUsers,
        inactive: totalUsers - activeUsers
      },
      categories: {
        total: totalCategories
      },
      topMovies: {
        byViews: topMoviesByViews,
        byDownloads: topMoviesByDownloads
      }
    }
  });
});

// @desc    Get movie statistics
// @route   GET /api/stats/movies
// @access  Private/Admin
const getMovieStats = asyncHandler(async (req, res) => {
  const movieStats = await Movie.aggregate([
    { $group: { 
      _id: "$quality", 
      count: { $sum: 1 },
      avgRating: { $avg: "$rating" },
      totalViews: { $sum: "$views" },
      totalDownloads: { $sum: "$downloads" }
    }},
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: movieStats
  });
});

// @desc    Get user activity statistics
// @route   GET /api/stats/activity
// @access  Private/Admin
const getActivityStats = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const activityStats = await User.aggregate([
    { $match: { lastLogin: { $exists: true } } },
    { $group: { 
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } },
      count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } },
    { $limit: parseInt(days) }
  ]);

  res.json({
    success: true,
    data: activityStats
  });
});

module.exports = {
  getStats,
  getMovieStats,
  getActivityStats
};
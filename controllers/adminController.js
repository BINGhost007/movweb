const Movie = require('../models/Movie');
const User = require('../models/User');
const ViewingHistory = require('../models/ViewingHistory');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600 // 100MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, AVI, and MKV files are allowed.'));
    }
  }
});

// Get dashboard analytics
exports.getDashboard = async (req, res) => {
  try {
    // Get basic statistics
    const [
      totalUsers,
      totalMovies,
      totalViews,
      totalReviews,
      activeSubscriptions,
      recentUsers,
      popularMovies,
      revenueData
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Movie.countDocuments({ status: 'approved' }),
      ViewingHistory.aggregate([
        { $group: { _id: null, totalViews: { $sum: 1 } } }
      ]),
      Review.countDocuments({ isApproved: true }),
      User.countDocuments({ 
        'subscription.status': 'active',
        'subscription.plan': { $ne: 'free' }
      }),
      User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('profile.firstName profile.lastName email createdAt'),
      Movie.find({ status: 'approved' })
        .sort({ 'statistics.viewCount': -1 })
        .limit(10)
        .select('title statistics.viewCount statistics.averageRating'),
      // Revenue calculation (mock data - replace with actual payment system)
      User.aggregate([
        {
          $match: {
            'subscription.status': 'active',
            'subscription.plan': { $ne: 'free' }
          }
        },
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$subscription.plan', 'basic'] }, then: 9.99 },
                    { case: { $eq: ['$subscription.plan', 'premium'] }, then: 14.99 },
                    { case: { $eq: ['$subscription.plan', 'family'] }, then: 19.99 }
                  ],
                  default: 0
                }
              }
            }
          }
        }
      ])
    ]);

    const totalViewsCount = totalViews[0]?.totalViews || 0;

    // Get growth statistics
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const [
      usersGrowth,
      viewsGrowth,
      reviewsGrowth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: lastMonth } }),
      ViewingHistory.countDocuments({ startedAt: { $gte: lastMonth } }),
      Review.countDocuments({ createdAt: { $gte: lastMonth } })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMovies,
          totalViews: totalViewsCount,
          totalReviews,
          activeSubscriptions,
          usersGrowth,
          viewsGrowth,
          reviewsGrowth
        },
        recentUsers,
        popularMovies,
        revenue: revenueData
      }
    });

  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all movies with admin controls
exports.getAllMoviesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      contentType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (contentType) {
      query.contentType = contentType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
        { genres: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const movies = await Movie.find(query)
      .populate('createdBy', 'profile.firstName profile.lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      data: {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get all movies admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new movie
exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const movieData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Handle file uploads
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      movieData.videoFiles = [{
        quality: req.body.quality || '720p',
        url: `/uploads/videos/${videoFile.filename}`,
        fileSize: videoFile.size,
        duration: parseInt(req.body.duration) || 0,
        bitrate: parseInt(req.body.bitrate) || 0
      }];
    }

    // Handle image uploads
    if (req.files && req.files.images) {
      const images = req.files.images.map(file => ({
        type: req.body.imageType || 'poster',
        url: `/uploads/images/${file.filename}`,
        alt: req.body.imageAlt || '',
        size: file.size
      }));
      movieData.images = images;
    }

    const movie = new Movie(movieData);
    await movie.save();

    logger.info(`Movie created by admin ${req.user.email}: ${movie.title}`);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: { movie }
    });

  } catch (error) {
    logger.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Update movie data
    Object.assign(movie, req.body);
    movie.lastModifiedBy = req.user._id;

    await movie.save();

    logger.info(`Movie updated by admin ${req.user.email}: ${movie.title}`);

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: { movie }
    });

  } catch (error) {
    logger.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete movie
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Soft delete by changing status
    movie.status = 'archived';
    movie.lastModifiedBy = req.user._id;
    await movie.save();

    logger.info(`Movie archived by admin ${req.user.email}: ${movie.title}`);

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });

  } catch (error) {
    logger.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Approve/Reject movie
exports.updateMovieStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    movie.status = status;
    movie.lastModifiedBy = req.user._id;
    
    if (adminNotes) {
      movie.adminNotes = adminNotes;
    }

    await movie.save();

    logger.info(`Movie status updated by admin ${req.user.email}: ${movie.title} -> ${status}`);

    res.json({
      success: true,
      message: 'Movie status updated successfully',
      data: { movie }
    });

  } catch (error) {
    logger.error('Update movie status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      subscriptionPlan,
      subscriptionStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    if (subscriptionPlan) {
      query['subscription.plan'] = subscriptionPlan;
    }

    if (subscriptionStatus) {
      query['subscription.status'] = subscriptionStatus;
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password -refreshTokens')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user subscription
exports.updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status, autoRenew, endDate } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update subscription
    if (plan) user.subscription.plan = plan;
    if (status) user.subscription.status = status;
    if (typeof autoRenew === 'boolean') user.subscription.autoRenew = autoRenew;
    if (endDate) user.subscription.endDate = new Date(endDate);

    await user.save();

    logger.info(`User subscription updated by admin ${req.user.email}: ${user.email} -> ${plan || user.subscription.plan}`);

    res.json({
      success: true,
      message: 'User subscription updated successfully',
      data: { user }
    });

  } catch (error) {
    logger.error('Update user subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Deactivate/Activate user
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    logger.info(`User status updated by admin ${req.user.email}: ${user.email} -> ${isActive ? 'active' : 'deactivated'}`);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });

  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all reviews with moderation controls
exports.getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      movieId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};

    if (status) {
      query.moderationStatus = status;
    }

    if (movieId) {
      query.movieId = movieId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const reviews = await Review.find(query)
      .populate('userId', 'profile.firstName profile.lastName profile.avatar')
      .populate('movieId', 'title')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Moderate review
exports.moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { moderationStatus, adminNotes } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'flagged'];
    if (!validStatuses.includes(moderationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moderation status'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.moderationStatus = moderationStatus;
    review.adminNotes = adminNotes || '';
    review.isApproved = moderationStatus === 'approved';

    await review.save();

    logger.info(`Review moderated by admin ${req.user.email}: ${review._id} -> ${moderationStatus}`);

    res.json({
      success: true,
      message: 'Review moderated successfully',
      data: { review }
    });

  } catch (error) {
    logger.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get analytics data
    const [
      dailyActiveUsers,
      dailyViews,
      topMovies,
      genreStats,
      subscriptionStats
    ] = await Promise.all([
      // Daily active users
      ViewingHistory.aggregate([
        {
          $match: {
            startedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$startedAt' }
            },
            users: { $addToSet: '$userId' },
            views: { $sum: 1 }
          }
        },
        {
          $project: {
            date: '$_id',
            activeUsers: { $size: '$users' },
            views: 1,
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]),

      // Daily viewing statistics
      ViewingHistory.aggregate([
        {
          $match: {
            startedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$startedAt' }
            },
            totalViews: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            totalWatchTime: { $sum: '$watchDuration' }
          }
        },
        {
          $project: {
            date: '$_id',
            totalViews: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            totalWatchTime: 1,
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]),

      // Top movies by views
      ViewingHistory.aggregate([
        {
          $match: {
            startedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$movieId',
            viewCount: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            totalWatchTime: { $sum: '$watchDuration' }
          }
        },
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movie'
          }
        },
        {
          $unwind: '$movie'
        },
        {
          $project: {
            movieId: '$_id',
            title: '$movie.title',
            viewCount: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            totalWatchTime: 1,
            _id: 0
          }
        },
        { $sort: { viewCount: -1 } },
        { $limit: 10 }
      ]),

      // Genre statistics
      Movie.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        { $unwind: '$genres' },
        {
          $group: {
            _id: '$genres',
            movieCount: { $sum: 1 },
            avgRating: { $avg: '$statistics.averageRating' }
          }
        },
        { $sort: { movieCount: -1 } }
      ]),

      // Subscription statistics
      User.aggregate([
        {
          $group: {
            _id: {
              plan: '$subscription.plan',
              status: '$subscription.status'
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        period,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        dailyActiveUsers,
        dailyViews,
        topMovies,
        genreStats,
        subscriptionStats
      }
    });

  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Bulk import movies
exports.bulkImportMovies = async (req, res) => {
  try {
    const { movies } = req.body;

    if (!Array.isArray(movies) || movies.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Movies array is required'
      });
    }

    const results = {
      success: [],
      errors: []
    };

    for (let i = 0; i < movies.length; i++) {
      try {
        const movieData = {
          ...movies[i],
          createdBy: req.user._id,
          status: 'pending'
        };

        const movie = new Movie(movieData);
        await movie.save();
        
        results.success.push({
          index: i,
          title: movie.title,
          id: movie._id
        });

      } catch (error) {
        results.errors.push({
          index: i,
          error: error.message
        });
      }
    }

    logger.info(`Bulk import completed by admin ${req.user.email}: ${results.success.length} success, ${results.errors.length} errors`);

    res.json({
      success: true,
      message: 'Bulk import completed',
      data: results
    });

  } catch (error) {
    logger.error('Bulk import movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  ...exports,
  upload
};
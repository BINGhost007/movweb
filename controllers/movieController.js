const Movie = require('../models/Movie');
const ViewingHistory = require('../models/ViewingHistory');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Get popular movies for carousel/grid
exports.getPopularMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      year,
      sortBy = 'trendingScore'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {
      status: 'approved',
      'availability.isActive': true
    };

    // Add genre filter
    if (genre) {
      query.genres = { $in: [genre] };
    }

    // Add year filter
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.releaseDate = { $gte: startDate, $lte: endDate };
    }

    // Execute query with aggregation for better performance
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'reviews',
          let: { movieId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$movieId', '$$movieId'] },
                isApproved: true
              }
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                ratingCount: { $sum: 1 }
              }
            }
          ],
          as: 'ratingData'
        }
      },
      {
        $addFields: {
          computedRating: {
            $ifNull: [
              { $arrayElemAt: ['$ratingData.averageRating', 0] },
              0
            ]
          },
          computedRatingCount: {
            $ifNull: [
              { $arrayElemAt: ['$ratingData.ratingCount', 0] },
              0
            ]
          }
        }
      },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: 1,
          overview: 1,
          poster: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$images',
                  cond: { $eq: ['$$this.type', 'poster'] }
                }
              },
              0
            ]
          },
          genres: 1,
          releaseDate: 1,
          runtime: 1,
          contentRating: 1,
          computedRating: 1,
          computedRatingCount: 1,
          trendingScore: 1,
          statistics: {
            viewCount: 1,
            likeCount: 1
          },
          trailer: 1
        }
      }
    ];

    const movies = await Movie.aggregate(pipeline);
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
    logger.error('Get popular movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all movies with advanced filtering and search
exports.getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      genre,
      year,
      rating,
      contentRating,
      language,
      sortBy = 'releaseDate',
      sortOrder = 'desc',
      minRating
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {
      status: 'approved',
      'availability.isActive': true
    };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Genre filter
    if (genre) {
      const genres = Array.isArray(genre) ? genre : [genre];
      query.genres = { $in: genres };
    }

    // Year filter
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.releaseDate = { $gte: startDate, $lte: endDate };
    }

    // Rating filter
    if (rating) {
      query['statistics.averageRating'] = { $gte: parseFloat(rating) };
    }

    // Content rating filter
    if (contentRating) {
      const ratings = Array.isArray(contentRating) ? contentRating : [contentRating];
      query.contentRating = { $in: ratings };
    }

    // Language filter
    if (language) {
      query.languages = { $in: [language] };
    }

    // Minimum rating filter
    if (minRating) {
      query['statistics.averageRating'] = { $gte: parseFloat(minRating) };
    }

    // Sort configuration
    const sort = {};
    const validSortFields = ['title', 'releaseDate', 'runtime', 'statistics.viewCount', 'statistics.averageRating', 'trendingScore'];
    
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = -1;
    }

    // Add text score for search relevance
    const addFields = {};
    if (search) {
      addFields.textScore = { $meta: 'textScore' };
      sort.textScore = { $meta: 'textScore' };
    }

    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'reviews',
          let: { movieId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$movieId', '$$movieId'] },
                isApproved: true
              }
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                ratingCount: { $sum: 1 }
              }
            }
          ],
          as: 'ratingData'
        }
      },
      {
        $addFields: {
          ...addFields,
          computedRating: {
            $ifNull: [
              { $arrayElemAt: ['$ratingData.averageRating', 0] },
              0
            ]
          },
          computedRatingCount: {
            $ifNull: [
              { $arrayElemAt: ['$ratingData.ratingCount', 0] },
              0
            ]
          }
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: 1,
          overview: 1,
          poster: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$images',
                  cond: { $eq: ['$$this.type', 'poster'] }
                }
              },
              0
            ]
          },
          genres: 1,
          releaseDate: 1,
          runtime: 1,
          contentRating: 1,
          languages: 1,
          computedRating: 1,
          computedRatingCount: 1,
          trendingScore: 1,
          statistics: {
            viewCount: 1,
            likeCount: 1
          },
          trailer: 1,
          textScore: { $ifNull: ['$textScore', 0] }
        }
      }
    ];

    const movies = await Movie.aggregate(pipeline);
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
        },
        filters: {
          search: search || '',
          genre: genre || null,
          year: year || null,
          rating: rating || null,
          contentRating: contentRating || null,
          language: language || null,
          minRating: minRating || null,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    logger.error('Get all movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get movie details by ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id)
      .populate('createdBy', 'profile.firstName profile.lastName')
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        options: {
          sort: { createdAt: -1 },
          limit: 10,
          populate: {
            path: 'userId',
            select: 'profile.firstName profile.lastName profile.avatar'
          }
        }
      });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user has access to this content
    let hasAccess = false;
    let canDownload = false;
    
    if (req.user) {
      hasAccess = req.user.hasAccessToContent(movie.contentType);
      canDownload = hasAccess && (req.user.subscription.plan === 'premium' || req.user.subscription.plan === 'family');
    }

    // Increment view count
    movie.statistics.viewCount += 1;
    await movie.save();

    // Get user's watchlist status and viewing progress
    let watchlistStatus = false;
    let viewingProgress = null;
    
    if (req.user) {
      const watchlist = await Watchlist.findOne({ userId: req.user._id });
      if (watchlist) {
        watchlistStatus = watchlist.items.some(item => 
          item.movieId.toString() === movie._id.toString()
        );
      }

      const viewingHistory = await ViewingHistory.findOne({
        userId: req.user._id,
        movieId: movie._id
      });

      if (viewingHistory) {
        viewingProgress = {
          progress: viewingHistory.progress,
          lastPosition: viewingHistory.lastPosition,
          totalDuration: viewingHistory.totalDuration,
          isCompleted: viewingHistory.isCompleted
        };
      }
    }

    // Get related movies (same genre)
    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      genres: { $in: movie.genres },
      status: 'approved',
      'availability.isActive': true
    })
    .select('title poster overview genres releaseDate')
    .limit(6)
    .sort({ trendingScore: -1 });

    res.json({
      success: true,
      data: {
        movie,
        userData: {
          hasAccess,
          canDownload,
          watchlistStatus,
          viewingProgress
        },
        relatedMovies
      }
    });

  } catch (error) {
    logger.error('Get movie by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Stream movie (requires authentication and subscription)
exports.streamMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality = '720p' } = req.query;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to stream movies'
      });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check access permissions
    if (!req.user.hasAccessToContent(movie.contentType)) {
      return res.status(402).json({
        success: false,
        message: 'Subscription required to access this content'
      });
    }

    // Find video file for requested quality
    const videoFile = movie.videoFiles.find(vf => vf.quality === quality);
    if (!videoFile) {
      return res.status(404).json({
        success: false,
        message: `Video quality ${quality} not available`
      });
    }

    // Record viewing session
    const viewingHistory = new ViewingHistory({
      userId: req.user._id,
      movieId: movie._id,
      progress: 0,
      lastPosition: 0,
      totalDuration: videoFile.duration,
      quality,
      device: req.get('User-Agent').includes('Mobile') ? 'mobile' : 'desktop',
      browser: req.get('User-Agent'),
      ipAddress: req.ip || req.connection.remoteAddress,
      isCompleted: false,
      watchDuration: 0
    });

    await viewingHistory.save();

    // Return video streaming URL and metadata
    res.json({
      success: true,
      data: {
        streamingUrl: videoFile.url,
        metadata: {
          title: movie.title,
          duration: videoFile.duration,
          quality: videoFile.quality,
          subtitles: movie.subtitles,
          accessibility: movie.accessibility
        },
        viewingSessionId: viewingHistory._id
      }
    });

  } catch (error) {
    logger.error('Stream movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Download movie (premium feature)
exports.downloadMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality = '720p' } = req.query;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to download movies'
      });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check download permissions
    if (!req.user.hasAccessToContent(movie.contentType)) {
      return res.status(402).json({
        success: false,
        message: 'Premium subscription required to download movies'
      });
    }

    if (req.user.subscription.plan !== 'premium' && req.user.subscription.plan !== 'family') {
      return res.status(402).json({
        success: false,
        message: 'Premium or Family plan required to download movies'
      });
    }

    // Find video file for requested quality
    const videoFile = movie.videoFiles.find(vf => vf.quality === quality);
    if (!videoFile) {
      return res.status(404).json({
        success: false,
        message: `Video quality ${quality} not available`
      });
    }

    // Increment download count
    movie.statistics.downloadCount += 1;
    await movie.save();

    // Return download URL and metadata
    res.json({
      success: true,
      data: {
        downloadUrl: videoFile.url,
        fileSize: videoFile.fileSize,
        quality: videoFile.quality,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        downloadLimit: req.user.subscription.plan === 'family' ? 10 : 5
      }
    });

  } catch (error) {
    logger.error('Download movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update viewing progress
exports.updateViewingProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, progress, duration, quality } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const viewingHistory = await ViewingHistory.findOne({
      userId: req.user._id,
      movieId: id
    });

    if (!viewingHistory) {
      return res.status(404).json({
        success: false,
        message: 'Viewing session not found'
      });
    }

    // Update viewing progress
    viewingHistory.progress = Math.max(0, Math.min(100, progress));
    viewingHistory.lastPosition = position;
    viewingHistory.totalDuration = duration;
    viewingHistory.quality = quality || viewingHistory.quality;
    viewingHistory.watchDuration += 10; // Assuming 10 second updates
    viewingHistory.lastWatchedAt = new Date();
    
    // Mark as completed if watched 90% or more
    if (progress >= 90) {
      viewingHistory.isCompleted = true;
    }

    await viewingHistory.save();

    res.json({
      success: true,
      message: 'Viewing progress updated',
      data: {
        progress: viewingHistory.progress,
        lastPosition: viewingHistory.lastPosition,
        isCompleted: viewingHistory.isCompleted
      }
    });

  } catch (error) {
    logger.error('Update viewing progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 10,
      genre,
      year,
      minRating
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build search query
    let searchQuery = {
      $text: { $search: query },
      status: 'approved',
      'availability.isActive': true
    };

    if (genre) {
      searchQuery.genres = { $in: [genre] };
    }

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      searchQuery.releaseDate = { $gte: startDate, $lte: endDate };
    }

    if (minRating) {
      searchQuery['statistics.averageRating'] = { $gte: parseFloat(minRating) };
    }

    const movies = await Movie.find(searchQuery)
      .select('title overview poster genres releaseDate runtime statistics computedRating')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        movies,
        query,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get movie recommendations based on viewing history
exports.getRecommendations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user's viewing history
    const viewingHistory = await ViewingHistory.find({ userId: req.user._id })
      .sort({ lastWatchedAt: -1 })
      .limit(20)
      .populate('movieId', 'genres statistics.averageRating');

    // Extract preferred genres from viewing history
    const genreCounts = {};
    viewingHistory.forEach(history => {
      if (history.movieId && history.movieId.genres) {
        history.movieId.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Sort genres by preference
    const preferredGenres = Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 5);

    // Get recommendations based on preferred genres
    const recommendations = await Movie.find({
      _id: { $nin: viewingHistory.map(h => h.movieId) },
      genres: { $in: preferredGenres },
      status: 'approved',
      'availability.isActive': true,
      'statistics.averageRating': { $gte: 3.0 }
    })
    .select('title overview poster genres releaseDate statistics computedRating')
    .sort({ 'statistics.averageRating': -1, trendingScore: -1 })
    .limit(20);

    res.json({
      success: true,
      data: {
        recommendations,
        preferences: {
          preferredGenres,
          totalWatched: viewingHistory.length
        }
      }
    });

  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
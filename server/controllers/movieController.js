const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie');
const Category = require('../models/Category');
const { uploadFile, deleteFile } = require('../utils/fileUpload');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', category = '', sort = 'createdAt', order = 'desc' } = req.query;

  // Build query
  const query = {};
  
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      query.categories = categoryDoc._id;
    }
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sort] = order === 'asc' ? 1 : -1;

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get movies with pagination
  const movies = await Movie.find(query)
    .populate('categories', 'name')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Movie.countDocuments(query);

  res.json({
    success: true,
    data: movies,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const movies = await Movie.find({ isPopular: true })
    .populate('categories', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: movies
  });
});

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
    .populate('categories', 'name')
    .populate('createdBy', 'name');

  if (movie) {
    // Increment views
    movie.views += 1;
    await movie.save();

    res.json({
      success: true,
      data: movie
    });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  const { title, description, year, duration, rating, quality, categories, tags, streamingUrl, downloadUrl, isPopular } = req.body;

  // Validate required fields
  if (!title || !description || !year || !duration || !rating || !quality || !categories) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Handle poster upload
  let posterUrl = '/uploads/default-movie.jpg';
  if (req.files && req.files.poster) {
    posterUrl = await uploadFile(req.files.poster);
  }

  // Create movie
  const movie = new Movie({
    title,
    description,
    year,
    duration,
    rating,
    quality,
    posterUrl,
    streamingUrl: streamingUrl || '',
    downloadUrl: downloadUrl || '',
    isPopular: isPopular || false,
    categories,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    createdBy: req.user._id
  });

  const createdMovie = await movie.save();

  res.status(201).json({
    success: true,
    data: createdMovie
  });
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const { title, description, year, duration, rating, quality, categories, tags, streamingUrl, downloadUrl, isPopular } = req.body;

  const movie = await Movie.findById(req.params.id);

  if (movie) {
    // Update fields
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.year = year || movie.year;
    movie.duration = duration || movie.duration;
    movie.rating = rating || movie.rating;
    movie.quality = quality || movie.quality;
    movie.categories = categories || movie.categories;
    movie.tags = tags ? tags.split(',').map(tag => tag.trim()) : movie.tags;
    movie.streamingUrl = streamingUrl || movie.streamingUrl;
    movie.downloadUrl = downloadUrl || movie.downloadUrl;
    movie.isPopular = isPopular !== undefined ? isPopular : movie.isPopular;

    // Handle poster upload
    if (req.files && req.files.poster) {
      // Delete old poster if it's not the default
      if (movie.posterUrl !== '/uploads/default-movie.jpg') {
        await deleteFile(movie.posterUrl);
      }
      movie.posterUrl = await uploadFile(req.files.poster);
    }

    const updatedMovie = await movie.save();

    res.json({
      success: true,
      data: updatedMovie
    });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    // Delete poster if it's not the default
    if (movie.posterUrl !== '/uploads/default-movie.jpg') {
      await deleteFile(movie.posterUrl);
    }

    await movie.remove();

    res.json({
      success: true,
      message: 'Movie removed'
    });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Get related movies
// @route   GET /api/movies/:id/related
// @access  Public
const getRelatedMovies = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    const relatedMovies = await Movie.find({
      categories: { $in: movie.categories },
      _id: { $ne: movie._id }
    })
    .populate('categories', 'name')
    .limit(6);

    res.json({
      success: true,
      data: relatedMovies
    });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Increment movie download count
// @route   POST /api/movies/:id/download
// @access  Private
const incrementDownload = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    movie.downloads += 1;
    await movie.save();

    res.json({
      success: true,
      message: 'Download counted',
      downloadUrl: movie.downloadUrl
    });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

module.exports = {
  getMovies,
  getPopularMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getRelatedMovies,
  incrementDownload
};
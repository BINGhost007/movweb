const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
    min: [1, 'Duration must be at least 1 minute']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating must be at most 10'],
    default: 0
  },
  quality: {
    type: String,
    required: [true, 'Please provide quality'],
    enum: ['SD', 'HD', 'Full HD', '4K', '8K'],
    default: 'HD'
  },
  posterUrl: {
    type: String,
    required: [true, 'Please provide a poster URL']
  },
  streamingUrl: {
    type: String,
    required: [true, 'Please provide a streaming URL']
  },
  downloadUrl: {
    type: String
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide at least one category']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Update updatedAt field
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
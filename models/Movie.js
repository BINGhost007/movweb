const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  character: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
});

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  job: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'General'
  },
  profileImage: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
});

const ratingSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['imdb', 'rotten_tomatoes', 'metacritic', 'internal', 'user']
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  voteCount: {
    type: Number,
    default: 0
  }
}, { _id: false });

const videoFileSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['480p', '720p', '1080p', '4k']
  },
  url: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  codec: {
    type: String,
    default: 'H.264'
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  bitrate: {
    type: Number, // in kbps
    required: true
  }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['poster', 'banner', 'gallery', 'backdrop', 'thumbnail']
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  size: {
    type: Number, // in bytes
    default: 0
  }
}, { _id: false });

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: ''
  },
  genres: [{
    type: String,
    required: true,
    index: true
  }],
  genreDetails: [{
    id: Number,
    name: String
  }],
  cast: [castSchema],
  crew: [crewSchema],
  releaseDate: {
    type: Date,
    required: true,
    index: true
  },
  runtime: {
    type: Number, // in minutes
    required: true
  },
  ratings: [ratingSchema],
  contentRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'],
    default: 'Not Rated'
  },
  languages: [{
    type: String,
    default: 'English'
  }],
  originalLanguage: {
    type: String,
    default: 'en'
  },
  subtitles: [{
    language: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ['vtt', 'srt'],
      default: 'vtt'
    }
  }],
  videoFiles: [videoFileSchema],
  trailer: {
    type: {
      type: String,
      enum: ['youtube', 'vimeo', 'direct'],
      default: 'youtube'
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: null
    }
  },
  images: [imageSchema],
  metadata: {
    productionCompany: {
      type: String,
      default: ''
    },
    productionCountries: [String],
    budget: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    awards: [String],
    keywords: [String]
  },
  statistics: {
    viewCount: {
      type: Number,
      default: 0,
      index: true
    },
    likeCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  },
  accessibility: {
    hasAudioDescription: {
      type: Boolean,
      default: false
    },
    hasClosedCaptions: {
      type: Boolean,
      default: true
    },
    audioLanguages: [String],
    signLanguageSupported: {
      type: Boolean,
      default: false
    }
  },
  availability: {
    regions: [String], // ISO country codes
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  contentType: {
    type: String,
    enum: ['standard', 'premium', 'exclusive'],
    default: 'standard'
  },
  isOriginal: {
    type: Boolean,
    default: false
  },
  trendingScore: {
    type: Number,
    default: 0,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'draft',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
movieSchema.index({ title: 'text', overview: 'text', synopsis: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ 'statistics.viewCount': -1 });
movieSchema.index({ 'statistics.averageRating': -1 });
movieSchema.index({ trendingScore: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ status: 1, 'availability.isActive': 1 });

// Virtual for average rating calculation
movieSchema.virtual('calculatedAverageRating').get(function() {
  const internalRatings = this.ratings.filter(r => r.source === 'internal');
  if (internalRatings.length === 0) return 0;
  
  const sum = internalRatings.reduce((acc, rating) => acc + rating.value, 0);
  return Math.round((sum / internalRatings.length) * 10) / 10;
});

// Method to calculate trending score
movieSchema.methods.calculateTrendingScore = function() {
  const now = new Date();
  const daysSinceRelease = Math.max(1, Math.floor((now - this.releaseDate) / (1000 * 60 * 60 * 24)));
  const ageFactor = Math.max(0.1, 1 / Math.log10(daysSinceRelease + 1));
  
  const views = this.statistics.viewCount || 0;
  const likes = this.statistics.likeCount || 0;
  const rating = this.statistics.averageRating || 0;
  
  const score = (views * 0.4 + likes * 0.3 + rating * 100 * 0.3) * ageFactor;
  
  this.trendingScore = Math.round(score * 100) / 100;
  return this.trendingScore;
};

// Method to update statistics
movieSchema.methods.updateStatistics = async function() {
  const User = mongoose.model('User');
  const Review = mongoose.model('Review');
  
  // Get view count from user interactions
  const viewStats = await User.aggregate([
    { $unwind: '$viewingHistory' },
    { $match: { 'viewingHistory.movieId': this._id } },
    { $group: { _id: null, count: { $sum: 1 } } }
  ]);
  
  // Get average rating from reviews
  const ratingStats = await Review.aggregate([
    { $match: { movieId: this._id, isApproved: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  // Update statistics
  this.statistics.viewCount = viewStats[0]?.count || 0;
  this.statistics.ratingCount = ratingStats[0]?.count || 0;
  this.statistics.averageRating = Math.round((ratingStats[0]?.avgRating || 0) * 10) / 10;
  
  // Recalculate trending score
  this.calculateTrendingScore();
  
  return this.save();
};

// Pre-save middleware
movieSchema.pre('save', function(next) {
  if (this.isModified('statistics') || this.isNew) {
    this.calculateTrendingScore();
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
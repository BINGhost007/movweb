const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  reportedCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    enum: ['spoiler', 'inappropriate', 'off-topic', 'helpful', 'well-written']
  }],
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: 500
  },
  editedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });
reviewSchema.index({ movieId: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Virtual for helpfulness percentage
reviewSchema.virtual('helpfulnessPercentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / this.totalVotes) * 100);
});

// Pre-save middleware to update movie rating
reviewSchema.post('save', async function(doc) {
  if (doc.isApproved && !doc.deletedAt) {
    const Movie = mongoose.model('Movie');
    const movie = await Movie.findById(doc.movieId);
    if (movie) {
      await movie.updateStatistics();
    }
  }
});

// Pre-remove middleware to update movie rating
reviewSchema.pre('remove', async function(next) {
  if (this.isApproved) {
    const Movie = mongoose.model('Movie');
    const movie = await Movie.findById(this.movieId);
    if (movie) {
      await movie.updateStatistics();
    }
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
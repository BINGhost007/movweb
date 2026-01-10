const mongoose = require('mongoose');

const viewingHistorySchema = new mongoose.Schema({
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
  progress: {
    type: Number,
    default: 0, // percentage watched (0-100)
    min: 0,
    max: 100
  },
  lastPosition: {
    type: Number, // in seconds
    default: 0
  },
  totalDuration: {
    type: Number, // in seconds
    required: true
  },
  quality: {
    type: String,
    enum: ['480p', '720p', '1080p', '4k'],
    default: '720p'
  },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'tv', 'unknown'],
    default: 'unknown'
  },
  browser: {
    type: String,
    default: 'unknown'
  },
  ipAddress: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  watchDuration: {
    type: Number, // actual time watched in seconds
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for performance
viewingHistorySchema.index({ userId: 1, lastWatchedAt: -1 });
viewingHistorySchema.index({ userId: 1, isCompleted: 1 });
viewingHistorySchema.index({ movieId: 1, lastWatchedAt: -1 });

module.exports = mongoose.model('ViewingHistory', viewingHistorySchema);
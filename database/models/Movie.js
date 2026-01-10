const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  duration: { type: Number, required: true },
  rating: { type: Number, required: true, default: 0 },
  quality: { type: String, required: true, enum: ['SD', 'HD', 'Full HD', '4K', '8K'], default: 'HD' },
  posterUrl: { type: String, required: true },
  streamingUrl: { type: String, required: true },
  downloadUrl: { type: String },
  isPopular: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Movie', movieSchema);
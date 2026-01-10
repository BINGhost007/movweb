const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  addedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }]
}, { _id: false });

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: 'My Watchlist'
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  items: [watchlistItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
watchlistSchema.index({ userId: 1, 'items.addedAt': -1 });
watchlistSchema.index({ userId: 1, isDefault: 1 });

// Virtual for total items count
watchlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Pre-save middleware to update totalItems
watchlistSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalItems = this.items.length;
    this.lastModified = new Date();
  }
  next();
});

// Method to add item to watchlist
watchlistSchema.methods.addItem = function(movieId, options = {}) {
  const existingItem = this.items.find(item => item.movieId.toString() === movieId.toString());
  
  if (existingItem) {
    throw new Error('Movie is already in watchlist');
  }
  
  const newItem = {
    movieId,
    addedAt: new Date(),
    notes: options.notes || '',
    priority: options.priority || 'medium',
    tags: options.tags || []
  };
  
  this.items.push(newItem);
  return this.save();
};

// Method to remove item from watchlist
watchlistSchema.methods.removeItem = function(movieId) {
  const initialLength = this.items.length;
  this.items = this.items.filter(item => item.movieId.toString() !== movieId.toString());
  
  if (this.items.length === initialLength) {
    throw new Error('Movie not found in watchlist');
  }
  
  return this.save();
};

// Method to update item notes
watchlistSchema.methods.updateItemNotes = function(movieId, notes) {
  const item = this.items.find(item => item.movieId.toString() === movieId.toString());
  
  if (!item) {
    throw new Error('Movie not found in watchlist');
  }
  
  item.notes = notes;
  return this.save();
};

// Method to get sorted items
watchlistSchema.methods.getSortedItems = function(sortBy = 'addedAt', order = -1) {
  const validSortFields = ['addedAt', 'priority', 'movieId'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'addedAt';
  
  return this.items.sort((a, b) => {
    if (sortField === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return (priorityOrder[b.priority] - priorityOrder[a.priority]) * order;
    }
    return (a[sortField] > b[sortField] ? 1 : -1) * order;
  });
};

module.exports = mongoose.model('Watchlist', watchlistSchema);
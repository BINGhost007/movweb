const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider;
    },
    minlength: 8
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'apple', 'facebook', 'twitter', null],
    default: null
  },
  oauthId: {
    type: String,
    default: null
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    preferences: {
      language: {
        type: String,
        default: 'en'
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      quality: {
        type: String,
        enum: ['480p', '720p', '1080p', '4k'],
        default: '720p'
      },
      notifications: {
        type: Boolean,
        default: true
      }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'family'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  familyMembers: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    profileColor: {
      type: String,
      default: '#3b82f6'
    },
    isKid: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, rounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to create refresh token
userSchema.methods.createRefreshToken = function() {
  const token = require('crypto').randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  this.refreshTokens.push({
    token,
    expiresAt
  });
  
  return token;
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Method to verify subscription access
userSchema.methods.hasAccessToContent = function(contentType = 'standard') {
  const subscriptionPlan = this.subscription.plan;
  const subscriptionStatus = this.subscription.status;
  
  if (subscriptionStatus !== 'active') return false;
  
  switch (contentType) {
    case 'standard':
      return ['basic', 'premium', 'family'].includes(subscriptionPlan);
    case 'premium':
      return ['premium', 'family'].includes(subscriptionPlan);
    case '4k':
      return subscriptionPlan === 'premium' || subscriptionPlan === 'family';
    default:
      return false;
  }
};

module.exports = mongoose.model('User', userSchema);
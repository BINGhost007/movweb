const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
    issuer: 'movweb-api',
    audience: 'movweb-users'
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'movweb-api',
    audience: 'movweb-users'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'movweb-api',
      audience: 'movweb-users'
    });
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return jwt.sign(
    { type: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify password reset token
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'movweb-api',
      audience: 'movweb-users'
    });
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    logger.error('Password reset token verification failed:', error);
    throw new Error('Invalid or expired reset token');
  }
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return jwt.sign(
    { type: 'email-verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify email verification token
const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'movweb-api',
      audience: 'movweb-users'
    });
    
    if (decoded.type !== 'email-verification') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    logger.error('Email verification token verification failed:', error);
    throw new Error('Invalid or expired verification token');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken
};
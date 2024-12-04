// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
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
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: '/uploads/profile-pictures/default-avatar.png'
  },
  socialLogins: [{
    provider: {
      type: String,
      enum: ['google', 'facebook', 'apple', 'microsoft']
    },
    providerId: {
      type: String,
      unique: true
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Add method to check if user has a specific social login
UserSchema.methods.hasSocialLogin = function(provider) {
  return this.socialLogins.some(login => login.provider === provider);
};

module.exports = mongoose.model('User', UserSchema);
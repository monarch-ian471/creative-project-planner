const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
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

// Indexes
UserSchema.index({ email: 1 }); // Fast lookup for email
UserSchema.index({ role: 1 }); // Queries by role
UserSchema.index({ 'socialLogins.providerId': 1 }, { unique: true }); // Prevent duplicate social logins

//Instance Method: Generate JWT
UserSchema.methods.generateAuthToken = function () {
  const payload = { 
    id: this._id, 
    email: this.email, 
    role: this.role 
  };
  const secret = process.env.JWT_SECRET || 'your_secret_key';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

//Instance Method: Check password validity
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Store the hashed token and set an expiration date
  this.passwordResetToken = hash;
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

// Hash Password Before Save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Instance Method: Check Password Validity
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    // Remove unique constraint if it's causing issues
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  country: String,
  streetAddress: String,
  city: String,
  region: String,
  postalCode: String,
  password: {
    type: String,
    required: true,
  },
  notifications: {
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, profilePicture: {
    type: String,
    default: '/uploads/profile-pictures/default-avatar.png'
  },
}, {

  indexes: [
    // Ensure a non-null index for firstName if needed
    { firstName: 1 },
  ]
});
const User = mongoose.model('User', userSchema);
module.exports = { User };
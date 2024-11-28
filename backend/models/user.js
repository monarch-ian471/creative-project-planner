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
  },
}, {
  // Add indexing options at the schema level
  indexes: [
    // Ensure a non-null index for firstName if needed
    { firstName: 1 },
  ]
});

// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);
module.exports = { User };
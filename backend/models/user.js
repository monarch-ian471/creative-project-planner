const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // Remove unique: true
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Keep unique on email
  phone: { type: String, required: true },
  country: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String, required: true },
  password: { type: String, required: true },
  notifications: {
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false }
  }
}, {
  timestamps: true 
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
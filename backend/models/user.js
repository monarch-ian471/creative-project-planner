// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    phone: { type: String },
    country: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    region: { type: String },
    postalCode: { type: String },
    notifications: { type: Boolean, default: false }, // Whether the user opted for notifications
    createdAt: { type: Date, default: Date.now }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

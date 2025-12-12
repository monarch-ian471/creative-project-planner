const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Creative Project Planner'
  },
  siteUrl: {
    type: String,
    default: 'https://creativeprojects.com'
  },
  contactEmail: {
    type: String,
    default: 'contact@creativeprojects.com'
  },
  supportEmail: {
    type: String,
    default: 'support@creativeprojects.com'
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowNewRegistrations: {
    type: Boolean,
    default: true
  },
  requireEmailVerification: {
    type: Boolean,
    default: true
  },
  maxUploadSize: {
    type: Number,
    default: 50
  },
  featuredProductsLimit: {
    type: Number,
    default: 10
  },
  enableNotifications: {
    type: Boolean,
    default: true
  },
  enableCommunityReviews: {
    type: Boolean,
    default: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);

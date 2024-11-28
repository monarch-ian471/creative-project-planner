const mongoose = require('mongoose');
const { User } = require('../models/user');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
    });

    console.log('MongoDB connected...');

    // Drop the unique index on firstName if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('firstName_1');
      console.log('Dropped unique index on firstName');
    } catch (indexDropError) {
      console.log('No existing firstName index to drop');
    }

    // Recreate indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ firstName: 1 });

    console.log('Indexes recreated successfully');

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
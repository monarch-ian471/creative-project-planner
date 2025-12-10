const mongoose = require('mongoose');
const { User } = require('../models/user');
const Project = require('../models/project');  // Import the Project model

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected...');

    // Drop the unique index on firstName if it exists for users
    try {
      await mongoose.connection.db.collection('users').dropIndex('firstName_1');
      // console.log('Dropped unique index on firstName');
    } catch (indexDropError) {
      console.log('No existing firstName index to drop');
    }

    // Recreate indexes for the users collection
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ firstName: 1 });

    // Create indexes for the projects collection
    await mongoose.connection.db.collection('projects').createIndex({ userId: 1, status: 1 }); // Index for filtering by user and status
    await mongoose.connection.db.collection('projects').createIndex({ dueDate: 1 }); // Index for faster due date queries

    console.log('Indexes recreated successfully for users and projects');

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

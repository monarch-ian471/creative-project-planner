const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    };

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });

    // Drop the unique index on firstName if it exists for users
    try {
      await mongoose.connection.db.collection('users').dropIndex('firstName_1');
      logger.debug('Dropped unique index on firstName');
    } catch (indexDropError) {
      logger.debug('No existing firstName index to drop');
    }

    // Recreate indexes for the users collection
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ firstName: 1 });
    await mongoose.connection.db.collection('users').createIndex({ isAdmin: 1 });

    // Create indexes for the projects collection
    await mongoose.connection.db.collection('projects').createIndex({ userId: 1, status: 1 });
    await mongoose.connection.db.collection('projects').createIndex({ dueDate: 1 });
    await mongoose.connection.db.collection('projects').createIndex({ createdAt: -1 });
    await mongoose.connection.db.collection('projects').createIndex({ userId: 1, createdAt: -1 });

    // Create indexes for the products collection
    await mongoose.connection.db.collection('products').createIndex({ sellerId: 1 });
    await mongoose.connection.db.collection('products').createIndex({ status: 1 });
    await mongoose.connection.db.collection('products').createIndex({ featured: 1 });
    await mongoose.connection.db.collection('products').createIndex({ category: 1 });
    await mongoose.connection.db.collection('products').createIndex({ createdAt: -1 });

    logger.info('Database indexes created successfully');

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err);
    });

  } catch (error) {
    logger.error('MongoDB Connection Error', error);
    process.exit(1);
  }
};

module.exports = connectDB;

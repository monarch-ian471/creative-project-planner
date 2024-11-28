const mongoose = require('mongoose');
const User = require('./models/user.js').User;

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');

    // Drop the unique index on firstName if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('firstName_1');
      console.log('Dropped unique index on firstName');
    } catch (indexDropError) {
      console.log('No existing firstName index to drop');
    }

    // Ensure other indexes are created
    await User.createIndexes();

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
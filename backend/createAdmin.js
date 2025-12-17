require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@creativeprojects.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.firstName, existingAdmin.lastName);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@creativeprojects.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'Admin@123', // This will be hashed by the pre-save middleware
      isAdmin: true,
      accountStatus: 'active',
      role: 'admin',
      isVerified: true,
      bio: 'System Administrator',
      preferences: {
        notifications: {
          email: true,
          sms: false
        },
        theme: 'light'
      },
      notificationSettings: {
        emailNotifications: true,
        projectUpdates: true,
        communityMessages: true,
        marketingEmails: false
      }
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: Admin@123');
    console.log('👤 Name:', adminUser.firstName, adminUser.lastName);
    console.log('🆔 User ID:', adminUser._id);
    console.log('🛡️  Role:', adminUser.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();

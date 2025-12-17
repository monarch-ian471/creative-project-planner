require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const getAdminDetails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const admin = await User.findOne({ email: 'admin@creativeprojects.com' });
    
    if (admin) {
      console.log('✅ Admin User Found!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', admin.email);
      console.log('👤 Name:', admin.firstName, admin.lastName);
      console.log('🆔 User ID:', admin._id);
      console.log('🛡️  Role:', admin.role);
      console.log('👑 Is Admin:', admin.isAdmin);
      console.log('📊 Account Status:', admin.accountStatus);
      console.log('✓ Is Verified:', admin.isVerified);
      console.log('📅 Created:', admin.createdAt);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔑 Default Password: Admin@123');
      console.log('⚠️  Change password after first login!\n');
    } else {
      console.log('❌ No admin user found. Run: node createAdmin.js');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

getAdminDetails();

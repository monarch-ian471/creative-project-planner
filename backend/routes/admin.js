const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Replace with actual database query
    // For now, using a hardcoded admin for demonstration
    const hardcodedAdmin = {
      _id: 'admin123',
      email: 'admin@creativeprojects.com',
      password: '$2a$10$your-hashed-password', // Replace with actual hashed password
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };
    
    // Find admin user in database
    // const admin = await User.findOne({ email, role: 'admin' });
    
    if (email !== hardcodedAdmin.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In production, use bcrypt.compare
    // const isValidPassword = await bcrypt.compare(password, admin.password);
    
    // For demo purposes, accepting any password
    // Remove this in production!
    const isValidPassword = true;
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: hardcodedAdmin._id, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: hardcodedAdmin._id,
        email: hardcodedAdmin.email,
        firstName: hardcodedAdmin.firstName,
        lastName: hardcodedAdmin.lastName
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // TODO: Implement actual database queries
    const stats = {
      totalUsers: 1250,
      totalProjects: 3420,
      totalSales: 850,
      revenue: 125000,
      activeCreators: 380,
      pendingOrders: 45
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all updates
router.get('/updates', async (req, res) => {
  try {
    // TODO: Implement database query
    const updates = [];
    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// Create new update
router.post('/updates', async (req, res) => {
  try {
    const { title, description, mediaUrl, mediaType, published } = req.body;
    
    // TODO: Save to database
    const newUpdate = {
      title,
      description,
      mediaUrl,
      mediaType,
      published,
      createdAt: new Date()
    };
    
    res.json(newUpdate);
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
});

// Update existing update
router.put('/updates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // TODO: Update in database
    res.json({ success: true, id, ...updateData });
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// Delete update
router.delete('/updates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Delete from database
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ error: 'Failed to delete update' });
  }
});

// Upload media file
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Helper functions (to be implemented with actual database queries)
async function getUserCount() {
  // TODO: Query database for user count
  return 150;
}

async function getProjectCount() {
  // TODO: Query database for project count
  return 342;
}

async function getSalesCount() {
  // TODO: Query database for sales count
  return 89;
}

async function calculateRevenue() {
  // TODO: Calculate total revenue from sales
  // Formula: (Total Sales * Platform Fee) - Operating Costs
  const totalSales = 1500000; // MWK
  const platformFee = 0.03; // 3%
  const operatingCosts = 50000; // Domain, database, admin costs
  
  return (totalSales * platformFee) - operatingCosts;
}

async function getActiveCreatorsCount() {
  // TODO: Query database for active creators
  return 120;
}

async function getPendingOrdersCount() {
  // TODO: Query database for pending orders
  return 12;
}

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    // TODO: Replace with actual database query
    // const users = await User.find().select('-password');
    
    const mockUsers = [
      {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        projectCount: 5,
        purchaseCount: 3
      },
      {
        _id: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-02-20'),
        projectCount: 8,
        purchaseCount: 12
      }
    ];
    
    res.json(mockUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Create new user
router.post('/users', authenticateAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, status } = req.body;
    
    // TODO: Check if user exists
    // const existingUser = await User.findOne({ email });
    
    // TODO: Hash password and save to database
    // const hashedPassword = await bcrypt.hash(tempPassword, 10);
    // const newUser = new User({ firstName, lastName, email, phone, role, status, password: hashedPassword });
    // await newUser.save();
    
    res.status(201).json({
      message: 'User created successfully',
      user: { firstName, lastName, email, role, status }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // TODO: Update in database
    // const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    
    res.json({
      message: 'User updated successfully',
      user: { _id: id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Delete from database
    // await User.findByIdAndDelete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ============================================
// PRODUCT MANAGEMENT ENDPOINTS
// ============================================

// Get all products
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    // TODO: Replace with actual database query
    // const products = await Product.find().populate('sellerId');
    
    const mockProducts = [
      {
        _id: 'prod1',
        name: 'Premium Design Template',
        description: 'Professional design template for creative projects',
        price: 49.99,
        category: 'Templates',
        images: ['https://via.placeholder.com/400'],
        sellerId: {
          _id: 'user1',
          firstName: 'John',
          lastName: 'Doe'
        },
        status: 'pending',
        featured: false,
        sales: 0,
        views: 45,
        rating: 0,
        createdAt: new Date('2024-03-10')
      },
      {
        _id: 'prod2',
        name: 'UI Kit Bundle',
        description: 'Complete UI kit with 100+ components',
        price: 79.99,
        category: 'UI Kits',
        images: ['https://via.placeholder.com/400'],
        sellerId: {
          _id: 'user2',
          firstName: 'Jane',
          lastName: 'Smith'
        },
        status: 'approved',
        featured: true,
        sales: 25,
        views: 320,
        rating: 4.8,
        createdAt: new Date('2024-02-15')
      }
    ];
    
    res.json(mockProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Approve product
router.put('/products/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Update in database
    // await Product.findByIdAndUpdate(id, { status: 'approved' });
    
    res.json({ message: 'Product approved successfully' });
  } catch (error) {
    console.error('Error approving product:', error);
    res.status(500).json({ message: 'Failed to approve product' });
  }
});

// Reject product
router.put('/products/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // TODO: Update in database and notify seller
    // await Product.findByIdAndUpdate(id, { status: 'rejected', rejectionReason: reason });
    
    res.json({ message: 'Product rejected successfully' });
  } catch (error) {
    console.error('Error rejecting product:', error);
    res.status(500).json({ message: 'Failed to reject product' });
  }
});

// Toggle featured status
router.put('/products/:id/featured', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    
    // TODO: Update in database
    // await Product.findByIdAndUpdate(id, { featured });
    
    res.json({ message: 'Featured status updated successfully' });
  } catch (error) {
    console.error('Error updating featured status:', error);
    res.status(500).json({ message: 'Failed to update featured status' });
  }
});

// Delete product
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Delete from database
    // await Product.findByIdAndDelete(id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// ============================================
// SETTINGS ENDPOINTS
// ============================================

// Get platform settings
router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    // TODO: Fetch from database
    // const settings = await Settings.findOne();
    
    const mockSettings = {
      siteName: 'Creative Project Planner',
      siteUrl: 'https://creativeprojects.com',
      contactEmail: 'contact@creativeprojects.com',
      supportEmail: 'support@creativeprojects.com',
      commissionRate: 10,
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: true,
      maxUploadSize: 50,
      featuredProductsLimit: 10,
      enableNotifications: true,
      enableCommunityReviews: true,
      currency: 'USD',
      timezone: 'America/New_York'
    };
    
    res.json(mockSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update platform settings
router.put('/settings', authenticateAdmin, async (req, res) => {
  try {
    const settingsData = req.body;
    
    // TODO: Update in database
    // await Settings.findOneAndUpdate({}, settingsData, { upsert: true });
    
    res.json({ message: 'Settings updated successfully', settings: settingsData });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;

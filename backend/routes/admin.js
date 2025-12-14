// routes/admin.js - Complete admin management operations
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { deleteFiles, deleteFile } = require('../utils/fileCleanup');
const { 
  getCache, 
  setCache, 
  CACHE_TTL, 
  cacheKeys, 
  invalidateProductCache,
  deleteCache
} = require('../middleware/cache');

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user is admin (you can add isAdmin field to User model)
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ===== ADMIN AUTHENTICATION =====

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    // Find user with admin privileges
    const user = await User.findOne({ email, isAdmin: true });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== DASHBOARD STATISTICS =====

// Get platform statistics - with caching
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const cacheKey = cacheKeys.stats();
    
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const [
      totalUsers,
      totalProjects,
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'approved' }),
      Product.countDocuments({ status: 'rejected' })
    ]);
    
    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Revenue calculation
    const products = await Product.find({ status: 'approved' });
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
    
    // Get settings for commission
    let settings = await Settings.findOne();
    const commissionRate = settings ? settings.commissionRate : 10;
    const platformRevenue = totalRevenue * (commissionRate / 100);
    
    const result = {
      users: {
        total: totalUsers,
        new: newUsers
      },
      projects: {
        total: totalProjects
      },
      products: {
        total: totalProducts,
        pending: pendingProducts,
        approved: approvedProducts,
        rejected: rejectedProducts
      },
      revenue: {
        total: totalRevenue,
        platform: platformRevenue,
        commissionRate
      }
    };
    
    // Cache for 5 minutes
    await setCache(cacheKey, result, CACHE_TTL.SHORT);
    
    res.json(result);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activity
router.get('/activity', authenticateAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const [recentUsers, recentProjects, recentProducts] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'firstName lastName email'),
      Product.find().sort({ createdAt: -1 }).limit(5).populate('sellerId', 'firstName lastName email')
    ]);
    
    res.json({
      recentUsers,
      recentProjects,
      recentProducts
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's projects and products
    const [projects, products] = await Promise.all([
      Project.find({ userId: user._id }),
      Product.find({ sellerId: user._id })
    ]);
    
    res.json({
      user,
      projects,
      products
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, isAdmin, accountStatus } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (accountStatus) user.accountStatus = accountStatus;
    
    await user.save();
    
    const updated = user.toObject();
    delete updated.password;
    
    res.json({
      message: 'User updated successfully',
      user: updated
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's projects and products for file cleanup
    const [projects, products] = await Promise.all([
      Project.find({ userId: user._id }),
      Product.find({ sellerId: user._id })
    ]);
    
    // Collect all files to delete
    const filesToDelete = [];
    
    // Add profile picture if not default
    if (user.profilePicture && !user.profilePicture.includes('default-avatar')) {
      filesToDelete.push(user.profilePicture);
    }
    
    // Add project media files
    projects.forEach(project => {
      if (project.media && project.media.length > 0) {
        filesToDelete.push(...project.media);
      }
    });
    
    // Add product images
    products.forEach(product => {
      if (product.images && product.images.length > 0) {
        filesToDelete.push(...product.images);
      }
    });
    
    // Delete all files
    if (filesToDelete.length > 0) {
      await deleteFiles(filesToDelete);
    }
    
    // Delete user's projects and products
    await Promise.all([
      Project.deleteMany({ userId: user._id }),
      Product.deleteMany({ sellerId: user._id })
    ]);
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== PRODUCT MANAGEMENT =====

// Get all products
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .populate('sellerId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve product
router.patch('/products/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.status = 'approved';
    product.rejectionReason = undefined;
    await product.save();
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, product.sellerId);
    await deleteCache(cacheKeys.stats());
    
    res.json({
      message: 'Product approved successfully',
      product
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject product
router.patch('/products/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.status = 'rejected';
    product.rejectionReason = reason;
    await product.save();
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, product.sellerId);
    await deleteCache(cacheKeys.stats());
    
    res.json({
      message: 'Product rejected',
      product
    });
  } catch (error) {
    console.error('Reject product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status
router.patch('/products/:id/featured', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved products can be featured' });
    }
    
    product.featured = !product.featured;
    await product.save();
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, product.sellerId);
    
    res.json({
      message: `Product ${product.featured ? 'featured' : 'unfeatured'}`,
      product
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated product images
    if (product.images && product.images.length > 0) {
      await deleteFiles(product.images);
    }
    
    const sellerId = product.sellerId;
    await Product.findByIdAndDelete(req.params.id);
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, sellerId);
    await deleteCache(cacheKeys.stats());
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== SETTINGS MANAGEMENT =====

// Get settings
router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        siteName: 'Creative Project Planner',
        siteUrl: 'https://creativeprojects.com',
        contactEmail: 'contact@creativeprojects.com',
        supportEmail: 'support@creativeprojects.com',
        commissionRate: 10,
        maintenanceMode: false,
        allowNewRegistrations: true,
        enableEmailNotifications: true,
        enableProjectUpdates: true,
        enableCommunityMessages: true,
        maxUploadSize: 10,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
        currency: 'USD',
        timezone: 'UTC'
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/settings', authenticateAdmin, async (req, res) => {
  try {
    const {
      siteName,
      siteUrl,
      contactEmail,
      supportEmail,
      commissionRate,
      maintenanceMode,
      allowNewRegistrations,
      enableEmailNotifications,
      enableProjectUpdates,
      enableCommunityMessages,
      maxUploadSize,
      allowedFileTypes,
      currency,
      timezone
    } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    if (siteName) settings.siteName = siteName;
    if (siteUrl) settings.siteUrl = siteUrl;
    if (contactEmail) settings.contactEmail = contactEmail;
    if (supportEmail) settings.supportEmail = supportEmail;
    if (commissionRate !== undefined) {
      if (commissionRate < 0 || commissionRate > 100) {
        return res.status(400).json({ message: 'Commission rate must be 0-100' });
      }
      settings.commissionRate = commissionRate;
    }
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowNewRegistrations !== undefined) settings.allowNewRegistrations = allowNewRegistrations;
    if (enableEmailNotifications !== undefined) settings.enableEmailNotifications = enableEmailNotifications;
    if (enableProjectUpdates !== undefined) settings.enableProjectUpdates = enableProjectUpdates;
    if (enableCommunityMessages !== undefined) settings.enableCommunityMessages = enableCommunityMessages;
    if (maxUploadSize) settings.maxUploadSize = maxUploadSize;
    if (allowedFileTypes) settings.allowedFileTypes = allowedFileTypes;
    if (currency) settings.currency = currency;
    if (timezone) settings.timezone = timezone;
    
    await settings.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== PROJECT MANAGEMENT =====

// Get all projects
router.get('/projects', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (status) query.status = status;
    
    const projects = await Project.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

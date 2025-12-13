// routes/community.js - Product marketplace CRUD operations
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const { 
  getCache, 
  setCache, 
  CACHE_TTL, 
  cacheKeys, 
  invalidateProductCache,
  cacheMiddleware 
} = require('../middleware/cache');

// Multer configuration for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ===== PUBLIC ROUTES =====

// Get all approved products (public) - with caching
router.get('/products', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      featured,
      sort = '-createdAt',
      page = 1, 
      limit = 12 
    } = req.query;
    
    // Create cache key from query params
    const cacheKey = cacheKeys.products({ category, search, minPrice, maxPrice, featured, sort, page, limit });
    
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { status: 'approved' };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
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
      .sort(sort);
    
    const total = await Product.countDocuments(query);
    
    const result = {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
    
    // Cache the result for 5 minutes
    await setCache(cacheKey, result, CACHE_TTL.SHORT);
    
    res.json(result);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product (public) - with caching
router.get('/products/:id', async (req, res) => {
  try {
    const cacheKey = cacheKeys.product(req.params.id);
    
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'firstName lastName email profilePicture');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'approved') {
      return res.status(403).json({ message: 'Product not available' });
    }
    
    // Increment views
    product.views += 1;
    await product.save();
    
    // Cache the updated product
    await setCache(cacheKey, product, CACHE_TTL.SHORT);
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== SELLER ROUTES (AUTHENTICATED) =====

// Get seller's own products
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = { sellerId: req.user.id };
    if (status) query.status = status;
    
    const products = await Product.find(query)
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
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'All fields required' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be positive' });
    }
    
    const newProduct = new Product({
      sellerId: req.user.id,
      name,
      description,
      price,
      category,
      status: 'pending' // Default status, requires admin approval
    });
    
    await newProduct.save();
    
    // Invalidate related caches
    await invalidateProductCache(newProduct._id, req.user.id);
    
    res.status(201).json({
      message: 'Product created successfully (pending approval)',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check ownership
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const { name, description, price, category } = req.body;
    
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) {
      if (price <= 0) {
        return res.status(400).json({ message: 'Price must be positive' });
      }
      product.price = price;
    }
    if (category) product.category = category;
    
    // Reset to pending if product was rejected and now updated
    if (product.status === 'rejected') {
      product.status = 'pending';
      product.rejectionReason = undefined;
    }
    
    await product.save();
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, req.user.id);
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload product images
router.post('/products/:id/images', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    product.images = [...product.images, ...imageUrls];
    
    await product.save();
    
    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    // Invalidate related caches
    await invalidateProductCache(req.params.id, req.user.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Record product sale
router.post('/products/:id/sale', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'approved') {
      return res.status(400).json({ message: 'Product not available for sale' });
    }
    
    product.sales += 1;
    await product.save();
    
    res.json({
      message: 'Sale recorded successfully',
      sales: product.sales
    });
  } catch (error) {
    console.error('Record sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate product
router.post('/products/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot rate this product' });
    }
    
    // Simple rating calculation (can be enhanced with user tracking)
    const currentTotal = product.rating.average * product.rating.count;
    product.rating.count += 1;
    product.rating.average = (currentTotal + rating) / product.rating.count;
    
    await product.save();
    
    res.json({
      message: 'Rating submitted successfully',
      rating: product.rating
    });
  } catch (error) {
    console.error('Rate product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product categories - with caching
router.get('/categories', async (req, res) => {
  try {
    const cacheKey = cacheKeys.categories();
    
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const categories = await Product.distinct('category', { status: 'approved' });
    
    // Cache for 1 hour
    await setCache(cacheKey, categories, CACHE_TTL.LONG);
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products - with caching
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const cacheKey = cacheKeys.featured();
    
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const products = await Product.find({ 
      status: 'approved', 
      featured: true 
    })
      .populate('sellerId', 'firstName lastName')
      .limit(limit)
      .sort('-createdAt');
    
    // Cache for 30 minutes
    await setCache(cacheKey, products, CACHE_TTL.MEDIUM);
    
    res.json(products);
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller statistics
router.get('/seller/stats', authenticateToken, async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    const [total, pending, approved, rejected] = await Promise.all([
      Product.countDocuments({ sellerId }),
      Product.countDocuments({ sellerId, status: 'pending' }),
      Product.countDocuments({ sellerId, status: 'approved' }),
      Product.countDocuments({ sellerId, status: 'rejected' })
    ]);
    
    const products = await Product.find({ sellerId });
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    const totalViews = products.reduce((sum, p) => sum + p.views, 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
    
    res.json({
      total,
      byStatus: { pending, approved, rejected },
      totalSales,
      totalViews,
      totalRevenue
    });
  } catch (error) {
    console.error('Get seller stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

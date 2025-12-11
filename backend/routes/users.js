// routes/users.js
const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Import the User model
const Project = require('../models/Project');

// ============================================
// USER AUTHENTICATION ENDPOINTS
// ============================================

// User registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // TODO: Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Email already registered' });
    // }
    
    // TODO: Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // TODO: Create user in database
    // const newUser = new User({
    //   firstName,
    //   lastName,
    //   email,
    //   password: hashedPassword,
    //   role: 'user',
    //   status: 'active'
    // });
    // await newUser.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: 'temp-user-id', role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: 'temp-user-id',
        firstName,
        lastName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // TODO: Find user in database
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    
    // TODO: Verify password
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    
    // For demo purposes - accepting any login
    // Remove this in production!
    const mockUser = {
      _id: 'user123',
      firstName: 'Demo',
      lastName: 'User',
      email: email,
      role: 'user'
    };
    
    // Create JWT token
    const token = jwt.sign(
      { id: mockUser._id, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ============================================
// EXISTING USER PROFILE ENDPOINTS
// ============================================



const sanitizeFilename = require('sanitize-filename');
// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/profile-pictures'));
    },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedFilename = sanitizeFilename(file.originalname);
        cb(null, `profile-${uniqueSuffix}-${sanitizedFilename}`);
      }
  });
  
  // Multer upload configuration
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
      }
    }    
  });
  // Get user profile endpoint
router.get('/profile', async (req, res) => {
    try {
      // Assuming you have user authentication middleware
      const checkJwt = require('../middleware/checkJwt');
      router.use(checkJwt); // Protect all routes in this file
 
      // that attaches user ID to the request
      const userId = req.user.id; 
  
      const user = await User.findById(userId).select('-password');
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: No user ID found' });
      }
      
      res.json({
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          location: {
            country: user.country,
            city: user.city,
            streetAddress: user.streetAddress
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  });
  
  // Get user stats endpoint
  router.get('/stats', async (req, res) => {
    try {
      const stats = await Project.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { 
          $group: { 
            _id: null,
            totalProjects: { $sum: 1 },
            completedProjects: { 
              $sum: { 
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] 
              }
            }
          }
        }
      ]);
      const result = stats[0] || { totalProjects: 0, completedProjects: 0 };
      res.json({
        stats: {
          totalProjects: result.totalProjects,
          completedProjects: result.completedProjects,
          pendingProjects: result.totalProjects - result.completedProjects,
        },
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user stats', error: error.message });
    }
  });
  
  // Upload profile picture endpoint
  router.post('/profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user's profile picture path
      user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      await user.save();
  
      res.json({ 
        message: 'Profile picture uploaded successfully',
        profilePictureUrl: user.profilePicture 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
    }
  });

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        password, 
        phone, 
        country, 
        streetAddress, 
        city, 
        region, 
        postalCode, 
        notifications 
    } = req.body;

    try {
        // Create a new user object with the data from the request
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            country,
            streetAddress,
            city,
            region,
            postalCode,
            notifications
        });

        // Save user to the database
        await newUser.save();

        // Return the newly created user
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

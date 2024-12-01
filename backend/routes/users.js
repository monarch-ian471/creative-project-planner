// routes/users.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require('../models/user');  // Import the User model
const Project = require('../models/project');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/profile-pictures'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
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
        cb(new Error('Invalid file type'), false);
      }
    }
  });
  // Get user profile endpoint
router.get('/profile', async (req, res) => {
    try {
      // Assuming you have user authentication middleware 
      // that attaches user ID to the request
      const userId = req.user.id; 
  
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
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
      const userId = req.user.id;
  
      const totalProjects = await Project.countDocuments({ userId });
      const completedProjects = await Project.countDocuments({ 
        userId, 
        status: 'completed' 
      });
  
      res.json({
        stats: {
          totalProjects,
          completedProjects,
          pendingProjects: totalProjects - completedProjects
        }
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

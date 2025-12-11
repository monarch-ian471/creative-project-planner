const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Direct import of jsonwebtoken
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/user.js');
const app = express();
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const communityRoutes = require('./routes/community');
const updatesRoutes = require('./routes/updates');
const statsRoutes = require('./routes/stats');

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'AUTH0_DOMAIN',
  'AUTH0_AUDIENCE'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please create a .env file with all required variables');
  process.exit(1);
}

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-domain.com']; //

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow requests from allowed origins
    } else {
      callback(new Error('Not allowed by CORS')); // Reject requests from disallowed origins
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // If you need to support cookies or Authorization headers
};
// Use the CORS middleware
app.use(cors(corsOptions)); // Enabling CORS for all routes
// Auth0 configuration
const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Connect to Database
connectDB();

// User Registration Route
app.post('/api/users/register', async (req, res) => {
  const { 
    firstName,
    lastName,
    email,
    phone,
    country,
    streetAddress,
    city,
    region,
    postalCode,
    password,
    notifications 
  } = req.body;

  try {

    // Validate input - ensure all required fields are present
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check database connection
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ message: 'Database connection error' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      country,
      streetAddress,
      city,
      region,
      postalCode,
      password,
      notifications,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with user data (excluding password) for successful registration
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      }
    });
  } catch (err) {
    console.error('Registration Error Details:', {
      message: err.message,
      stack: err.stack,
      input: req.body // Log input to see what's being sent
    });

    res.status(500).json({ 
      message: 'Server error during registration', 
      error: err.message 
    });
  }
});

// In the login route, replace jwt.sign with jwt.sign from jsonwebtoken
app.post('/api/users/login', async (req, res) => {
  console.log('Login attempt with:', req.body);
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found for email:', email);
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('Password mismatch for user:', email);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ user, token });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

// Enhanced Social Login Route in server.js or routes/users.js
app.post('/api/users/social-login', async (req, res) => {
  const { 
    email, 
    firstName, 
    lastName, 
    profilePicture, 
    provider 
  } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    let user = await User.findOne({ 
      email, 
      'socialLogins.provider': provider 
    });

    if (!user) {
      // Create new user if not exists
      user = new User({
        email,
        firstName,
        lastName,
        profilePicture,
        socialLogins: [{
          provider,
          providerId: generateProviderId()
        }],
        password: await bcrypt.hash(generateRandomPassword(), 10),
        isVerified: true // Social login users are typically verified
      });

      await user.save();
    } else {
      // Update existing user's information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.profilePicture = profilePicture || user.profilePicture;
      
      // Ensure social login is tracked
      if (!user.socialLogins.some(login => login.provider === provider)) {
        user.socialLogins.push({
          provider,
          providerId: generateProviderId()
        });
      }

      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture
      }, 
      token 
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ 
      message: 'Social login error', 
      error: error.message 
    });
  }
});

// Utility functions
function generateRandomPassword() {
  return crypto.randomBytes(20).toString('hex');
}

function generateProviderId() {
  return crypto.randomBytes(16).toString('hex');
}

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/stats', statsRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Example protected route
app.get('/api/protected', checkJwt, (req, res) => {
  res.send('This is a protected route, only accessible with a valid token');
});

// Error handling middleware for JWT authentication
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
});

// Project Routes (CRUD)
const Project = require('./models/project.js'); // Import the Project model

// Optional: Allow preflight requests (OPTIONS)
app.options('*', cors(corsOptions)); // Handles CORS preflight

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost: ${PORT}`));

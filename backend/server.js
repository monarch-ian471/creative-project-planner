const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Direct import of jsonwebtoken
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/user.js').User;
const app = express();
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');



// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-domain.com']; // Replace with your frontend domain

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


// Load environment variables
dotenv.config();

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

    const hashedPassword = await bcrypt.hash(password, 10); // Consistent salt rounds
      console.log('Raw Password:', password);
      console.log('Hashed Password:', hashedPassword);

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
        password: (generateRandomPassword(), 10),
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

app.use('/api/projects', projectRoutes);
// Create a new project
app.post('/api/projects', checkJwt, async (req, res) => {
  try {
    const newProject = new Project(req.body);  // Create a new project from the request body
    const savedProject = await newProject.save();  // Save project to database
    res.json(savedProject);  // Respond with the saved project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Get all projects
app.get('/api/projects', checkJwt, async (req, res) => {
  try {
    const projects = await Project.find();  // Fetch all projects from database
    res.json(projects);  // Respond with projects list
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Get a single project by ID
app.get('/api/projects/:id',checkJwt,  async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);  // Fetch project by ID
    if (!project) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(project);  // Respond with the project details
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Delete a project by ID
app.delete('/api/projects/:id', checkJwt, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);  // Delete project by ID
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json({ message: 'Project deleted' });  // Respond with success message
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Update a project by ID
app.put('/api/projects/:id', checkJwt, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Update project
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(updatedProject);  // Respond with updated project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Optional: Allow preflight requests (OPTIONS)
app.options('*', cors(corsOptions)); // Handles CORS preflight

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost: ${PORT}`));

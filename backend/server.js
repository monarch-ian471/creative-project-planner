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
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

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
const Project = require('./models/Project'); // Import the Project model

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);  // Create a new project from the request body
    const savedProject = await newProject.save();  // Save project to database
    res.json(savedProject);  // Respond with the saved project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();  // Fetch all projects from database
    res.json(projects);  // Respond with projects list
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get a single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);  // Fetch project by ID
    if (!project) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(project);  // Respond with the project details
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Delete a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);  // Delete project by ID
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json({ message: 'Project deleted' });  // Respond with success message
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// Update a project by ID
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Update project
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(updatedProject);  // Respond with updated project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

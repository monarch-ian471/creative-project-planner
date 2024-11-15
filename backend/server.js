const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bcrypt = require('bcrypt');
const { User } = require('./models/User'); // Adjust the path as needed
const app = express();  // Initialize Express app

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Auth0 configuration
const authConfig = {
  domain: process.env.AUTH0_DOMAIN || 'dev-lsauz5y1t0iz3nv2.us.auth0.com',
  audience: process.env.AUTH0_AUDIENCE || 'https://creative-project-planner-api.com',
};

// Middleware to check JWTs
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
});

// MongoDB Connection
const mongoURI = 'mongodb+srv://iankatengeza:Kerrina%402002@creative-project-planne.besma.mongodb.net/creative-project-planner?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------------------------------------------
// Routes
// ---------------------------------------------

// User Routes (for registration)
const userRoutes = require('./routes/users'); // Import user routes
app.use('/api/users', userRoutes); // Mount user routes

// POST /api/users/login - Authenticate a user
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a token (optional, if you're using JWT)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return user data and token
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

// ---------------------------------------------
// Start the server
// ---------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

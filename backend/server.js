const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/Project'); // Import the Project model
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();  // Initialize Express app

app.use(express.json());

app.use(cors());  // Add this line to enable CORS for all routes

// Auth0 configuration
const authConfig = {
  domain: process.env.AUTH0_DOMAIN || 'dev-lsauz5y1t0iz3nv2.us.auth0.com',
  audience: process.env.AUTH0_AUDIENCE || 'https://creative-project-planner-api.com',

  //apiIdentifier: 'https://creative-project-planner-api.com'
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

const mongoURI = 'mongodb+srv://iankatengeza:Kerrina%402002@creative-project-planne.besma.mongodb.net/creative-project-planner?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------------------------------------------
//  CRUD Operations and Routing
// ---------------------------------------------

// 1. Route: Home route for testing
// Protect routes with JWT middleware
app.get('/api/protected', checkJwt, (req, res) => {
  res.send('This is a protected route, only accessible with a valid token');
});

// 2. Route: Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);  // Create a new project from the request body
    const savedProject = await newProject.save();  // Save project to database
    res.json(savedProject);  // Respond with the saved project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// 3. Route: Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();  // Fetch all projects from database
    res.json(projects);  // Respond with projects list
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// 4. Route: Get a single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);  // Fetch project by ID
    if (!project) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(project);  // Respond with the project details
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// 5. Route: Update a project by ID
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Update project
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json(updatedProject);  // Respond with updated project
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// 6. Route: Delete a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);  // Delete project by ID
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });  // Handle project not found
    res.json({ message: 'Project deleted' });  // Respond with success message
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// ---------------------------------------------
// Start the server
// ---------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

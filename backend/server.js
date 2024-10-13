const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/Project'); // Import the Project model

const app = express();  // Initialize Express app

app.use(express.json());

const mongoURI = 'mongodb+srv://iankatengeza:Kerrina%402002@creative-project-planne.besma.mongodb.net/creative-project-planner?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------------------------------------------
// ROUTES
// ---------------------------------------------

// 1. Route: Home route for testing
app.get('/', (req, res) => {
  res.send('Creative Project Planner API');
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

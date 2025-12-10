const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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

// Get all projects (for authenticated user)
router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.sub; // Auth0 user ID
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single project by ID
router.get('/:id', checkJwt, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new project
router.post('/', checkJwt, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      userId: req.auth.sub // Set userId from authenticated user
    };
    
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a project by ID
router.put('/:id', checkJwt, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a project by ID
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a task to a project
router.post('/:id/tasks', checkJwt, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await project.addTask(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mark a task as completed
router.patch('/:projectId/tasks/:taskId/complete', checkJwt, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.auth.sub) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await project.completeTask(req.params.taskId);
    res.json(project);
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

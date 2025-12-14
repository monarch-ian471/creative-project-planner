// routes/projects.js - Complete CRUD operations
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const { deleteFiles } = require('../utils/fileCleanup');

// Multer configuration for project media
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/projects'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
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

// ===== PROJECT CRUD =====

// Get all projects (with optional filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = { userId: req.user.id };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      budget,
      status,
      priority,
      tags,
      phases,
      teamMembers,
      milestones,
      resources
    } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description required' });
    }
    
    const newProject = new Project({
      userId: req.user.id,
      title,
      description,
      category,
      startDate,
      endDate,
      budget,
      status: status || 'planning',
      priority: priority || 'medium',
      tags: tags || [],
      phases: phases || [],
      teamMembers: teamMembers || [],
      milestones: milestones || [],
      resources: resources || []
    });
    
    await newProject.save();
    
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      budget,
      status,
      priority,
      progress,
      tags,
      phases,
      teamMembers,
      milestones,
      resources
    } = req.body;
    
    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (budget) project.budget = budget;
    if (status) {
      project.status = status;
      if (status === 'completed') {
        project.completionDate = new Date();
        project.progress = 100;
      }
    }
    if (priority) project.priority = priority;
    if (progress !== undefined) project.progress = progress;
    if (tags) project.tags = tags;
    if (phases) project.phases = phases;
    if (teamMembers) project.teamMembers = teamMembers;
    if (milestones) project.milestones = milestones;
    if (resources) project.resources = resources;
    
    await project.save();
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['planning', 'in-progress', 'on-hold', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    project.status = status;
    if (status === 'completed') {
      project.completionDate = new Date();
      project.progress = 100;
    }
    
    await project.save();
    
    res.json({
      message: 'Status updated successfully',
      project
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project progress
router.patch('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be 0-100' });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    project.progress = progress;
    
    if (progress === 100 && project.status !== 'completed') {
      project.status = 'completed';
      project.completionDate = new Date();
    }
    
    await project.save();
    
    res.json({
      message: 'Progress updated successfully',
      project
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload project media
router.post('/:id/media', authenticateToken, upload.array('media', 10), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const mediaUrls = req.files.map(file => `/uploads/projects/${file.filename}`);
    project.media = [...(project.media || []), ...mediaUrls];
    
    await project.save();
    
    res.json({
      message: 'Media uploaded successfully',
      mediaUrls
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Delete associated media files
    if (project.media && project.media.length > 0) {
      await deleteFiles(project.media);
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [total, planning, inProgress, onHold, completed, cancelled] = await Promise.all([
      Project.countDocuments({ userId }),
      Project.countDocuments({ userId, status: 'planning' }),
      Project.countDocuments({ userId, status: 'in-progress' }),
      Project.countDocuments({ userId, status: 'on-hold' }),
      Project.countDocuments({ userId, status: 'completed' }),
      Project.countDocuments({ userId, status: 'cancelled' })
    ]);
    
    const projects = await Project.find({ userId });
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const averageProgress = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length 
      : 0;
    
    res.json({
      total,
      byStatus: {
        planning,
        inProgress,
        onHold,
        completed,
        cancelled
      },
      totalBudget,
      averageProgress: Math.round(averageProgress)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

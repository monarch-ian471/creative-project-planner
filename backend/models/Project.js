const mongoose = require('mongoose');

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensure each task has a name
  },
  completed: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
});

// Define the Project schema
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true, // Trim whitespace
  },
  description: {
    type: String,
    required: true, // Description is required
    trim: true, // Trim whitespace
  },
  budget: {
    type: Number,
    required: true, // Budget is required
    min: 0, // Ensure budget is non-negative
  },
  tasks: [TaskSchema], // Embed Task schema
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true, // Link to a user who created the project
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// Export the Project model
module.exports = mongoose.model('Project', ProjectSchema);

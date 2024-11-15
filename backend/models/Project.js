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
// Define project schema
const projectSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      required: true,
  },
  dueDate: {
      type: Date,
      required: true,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

// Export the Project model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

const mongoose = require('mongoose');

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensure each task has a name
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  dueDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the Project schema
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    tasks: [TaskSchema], // Embed Task schema as a subdocument array
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'in-progress',
    },
  },
  { timestamps: true } // Auto-manage `createdAt` and `updatedAt`
);

// Indexes for better performance
projectSchema.index({ userId: 1, status: 1 }); // For quick filtering by user and status

// Instance Method: Add a new task
projectSchema.methods.addTask = function (task) {
  this.tasks.push(task);
  return this.save();
};

// Instance Method: Mark a task as completed
projectSchema.methods.completeTask = function (taskId) {
  const task = this.tasks.id(taskId);
  if (!task) throw new Error('Task not found');
  task.completed = true;
  return this.save();
};

// Static Method: Find projects by user ID
projectSchema.statics.findByUserId = function (userId) {
  return this.find({ userId });
};

// Static Method: Get overdue projects
projectSchema.statics.findOverdueProjects = function () {
  return this.find({ dueDate: { $lt: Date.now() }, status: 'in-progress' });
};

// Middleware: Update `updatedAt` on modification
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Project model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

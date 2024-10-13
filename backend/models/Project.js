const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  tasks: [{
    name: String,
    completed: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Project', ProjectSchema);

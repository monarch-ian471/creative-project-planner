const express = require('express');
const router = express.Router();

// Example endpoints for projects
router.get('/', (req, res) => {
  res.send('Get all projects');
});

router.post('/', (req, res) => {
  res.send('Create a project');
});

module.exports = router;

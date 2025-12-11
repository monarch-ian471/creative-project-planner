const express = require('express');
const router = express.Router();

// Get latest published updates for home page
router.get('/latest', async (req, res) => {
  try {
    // TODO: Query database for published updates, limit to 6 most recent
    const updates = [];
    
    res.json(updates);
  } catch (error) {
    console.error('Error fetching latest updates:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = router;

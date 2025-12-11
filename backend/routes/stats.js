const express = require('express');
const router = express.Router();

// Get platform statistics for home page
router.get('/platform', async (req, res) => {
  try {
    // TODO: Calculate real-time stats from database
    const stats = {
      creators: await getCreatorsCount(),
      platformFee: 3, // 3% fee
      uptime: 99.9,
      paidOut: await calculateTotalPaidOut()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Helper functions
async function getCreatorsCount() {
  // TODO: Query database for total number of creators
  return 150;
}

async function calculateTotalPaidOut() {
  // TODO: Calculate total amount paid to creators
  // Formula: (Total Sales from all creators) - (Platform Fee) - (Operating Costs)
  const totalSales = 1500000; // MWK from all sales
  const platformFee = 0.03; // 3%
  const operatingCosts = 50000; // Domain, database, admin, etc.
  
  const platformRevenue = totalSales * platformFee;
  const paidOutToCreators = totalSales - platformRevenue;
  
  return Math.round(paidOutToCreators);
}

module.exports = router;

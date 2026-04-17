const express = require('express');

const router = express.Router();

// Admin routes
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;

const express = require('express');

const router = express.Router();

// Game routes
router.get('/', (req, res) => {
  res.json({ message: 'Games routes' });
});

module.exports = router;

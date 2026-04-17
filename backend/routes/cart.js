const express = require('express');

const router = express.Router();

// Cart routes
router.get('/', (req, res) => {
  res.json({ message: 'Cart routes' });
});

module.exports = router;

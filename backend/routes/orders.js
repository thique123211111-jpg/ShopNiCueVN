const express = require('express');

const router = express.Router();

// Order routes
router.get('/', (req, res) => {
  res.json({ message: 'Order routes' });
});

module.exports = router;

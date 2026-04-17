const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/process', authMiddleware, paymentController.processPayment);
router.post('/callback', paymentController.handlePaymentCallback);
router.get('/history/:userId', authMiddleware, paymentController.getTransactionHistory);

module.exports = router;

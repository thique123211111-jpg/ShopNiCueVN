const pool = require('../config/database');
const axios = require('axios');

// Xử lý nạp tiền
exports.processPayment = async (req, res) => {
  try {
    const { userId, amount, paymentMethod, bankCode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền không hợp lệ',
      });
    }

    const conn = await pool.getConnection();

    // Tạo transaction
    const [result] = await conn.query(
      'INSERT INTO transactions (userId, amount, paymentMethod, bankCode, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, amount, paymentMethod, bankCode || '', 'pending']
    );

    conn.release();

    // Gọi API payment gateway tương ứng
    let paymentUrl = null;

    if (paymentMethod === 'card') {
      paymentUrl = await processCardPayment(amount, bankCode);
    } else if (paymentMethod === 'momo') {
      paymentUrl = await processMomoPayment(amount, userId, result.insertId);
    } else if (paymentMethod === 'bank') {
      paymentUrl = await processBankPayment(amount, userId, result.insertId);
    }

    res.json({
      success: true,
      message: 'Tạo yêu cầu thanh toán thành công',
      transactionId: result.insertId,
      paymentUrl,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xử lý thanh toán',
    });
  }
};

// Xử lý nạp thẻ cào
const processCardPayment = async (amount, bankCode) => {
  try {
    // Tích hợp với Viettel, Mobi, Vina API
    // Đây là ví dụ giả lập
    const payload = {
      amount: amount,
      bankCode: bankCode,
      timestamp: Date.now(),
    };

    // Gọi API gateway
    // const response = await axios.post(process.env.CARD_PAYMENT_API, payload);
    // return response.data.paymentUrl;

    // Return mock URL
    return `https://payment-gateway.example.com/charge/${Date.now()}`;
  } catch (error) {
    console.error('Card payment error:', error);
    throw error;
  }
};

// Xử lý thanh toán Momo
const processMomoPayment = async (amount, userId, transactionId) => {
  try {
    const payload = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_API_KEY,
      requestId: `${Date.now()}`,
      amount: amount,
      orderId: `order_${userId}_${transactionId}`,
      orderInfo: `NiCueVN - Nạp tiền ${amount} VND - User ${userId}`,
      redirectUrl: `${process.env.FRONTEND_URL}/payment/momo/callback`,
      ipnUrl: `${process.env.BACKEND_URL}/api/payment/momo/callback`,
      lang: 'vi',
      autoCapture: true,
      extraData: JSON.stringify({
        userId: userId,
        transactionId: transactionId,
      }),
    };

    // Gọi Momo API (giả lập)
    // const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', payload);

    // Return mock
    return `https://test-payment.momo.vn/payment/${Date.now()}`;
  } catch (error) {
    console.error('Momo payment error:', error);
    throw error;
  }
};

// Xử lý chuyển khoản ngân hàng
const processBankPayment = async (amount, userId, transactionId) => {
  try {
    // Tạo nội dung chuyển khoản
    const content = `NiCueVN USER_${userId}`;

    const paymentInfo = {
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      accountName: 'NICUEVN CO LTD',
      amount: amount,
      content: content,
      qrCode: `https://qr.example.com/vietcombank/${amount}/${content}`,
    };

    return null; // Bank transfer không có redirect URL
  } catch (error) {
    console.error('Bank payment error:', error);
    throw error;
  }
};

// Callback từ payment gateway
exports.handlePaymentCallback = async (req, res) => {
  try {
    const { transactionId, status, amount } = req.body;

    if (status === 'success' || status === 'completed') {
      const conn = await pool.getConnection();

      // Update transaction
      await conn.query(
        'UPDATE transactions SET status = ? WHERE id = ?',
        ['completed', transactionId]
      );

      // Get user ID từ transaction
      const [transactions] = await conn.query(
        'SELECT userId FROM transactions WHERE id = ?',
        [transactionId]
      );

      if (transactions.length > 0) {
        // Cộng tiền vào ví
        await conn.query(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [amount, transactions[0].userId]
        );
      }

      conn.release();

      res.json({
        success: true,
        message: 'Thanh toán thành công',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Thanh toán thất bại',
      });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xử lý callback',
    });
  }
};

// Lấy lịch sử giao dịch
exports.getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const conn = await pool.getConnection();

    const [transactions] = await conn.query(
      `SELECT * FROM transactions 
       WHERE userId = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    conn.release();

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch sử giao dịch',
    });
  }
};

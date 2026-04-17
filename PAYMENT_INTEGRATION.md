# 💳 Payment Integration Guide - NiCueVN

Chi tiết cách tích hợp các phương thức thanh toán cho hệ thống NiCueVN.

---

## 🎯 Overview

NiCueVN hỗ trợ 4 phương thức thanh toán:

1. **Thẻ Cào** (Viettel, Mobi, Vina)
2. **Momo**
3. **Chuyển Khoản Ngân Hàng**
4. **Ví Điện Tử**

---

## 1️⃣ Thẻ Cào (Viettel, Mobi, Vina)

### 1.1 API Integration Steps

**Step 1: Register with Telecom Provider**
- Visit Viettel: https://viettel.vn/business
- Visit Mobi: https://mobi.vn/partner
- Visit Vina: https://vina.vn/business

**Step 2: Get API Keys**
```
VIETTEL_API_KEY=viettel_key_here
MOBI_API_KEY=mobi_key_here
VINA_API_KEY=vina_key_here
```

**Step 3: Update .env**
```env
VIETTEL_API_KEY=your_viettel_api_key
MOBI_API_KEY=your_mobi_api_key
VINA_API_KEY=your_vina_api_key
```

### 1.2 Implementation

```javascript
// backend/controllers/paymentController.js
const processCardPayment = async (amount, bankCode) => {
  try {
    const apiUrl = getApiUrl(bankCode); // viettel | mobi | vina
    const apiKey = getApiKey(bankCode);
    
    const payload = {
      amount: amount,
      bankCode: bankCode,
      timestamp: Date.now(),
      signature: generateSignature(amount, bankCode, apiKey)
    };

    const response = await axios.post(apiUrl, payload, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    return response.data.paymentUrl;
  } catch (error) {
    throw error;
  }
};
```

### 1.3 Callback Handling

```javascript
app.post('/api/payment/card-callback', (req, res) => {
  const { transactionId, status, amount } = req.body;
  
  if (status === 'success') {
    // Credit user balance
    updateUserBalance(transactionId, amount);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});
```

---

## 2️⃣ Momo Integration

### 2.1 Setup

**Step 1: Register Partner Account**
- Website: https://developers.momo.vn
- Create partner account
- Get API credentials

**Step 2: Get Credentials**
```
MOMO_PARTNER_CODE=MOMO_PARTNER_CODE
MOMO_API_KEY=your_momo_api_key
MOMO_SECRET_KEY=your_momo_secret_key
```

**Step 3: Update .env**
```env
MOMO_PARTNER_CODE=MOMO123456
MOMO_API_KEY=your_api_key
MOMO_SECRET_KEY=your_secret_key
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/callback
MOMO_IPN_URL=http://localhost:5000/api/payment/momo/callback
```

### 2.2 Payment Creation

```javascript
const processMomoPayment = async (amount, userId, orderId) => {
  const requestId = `${Date.now()}`;
  const accessKey = process.env.MOMO_API_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const orderInfo = `NiCueVN - Nạp ${amount} VND`;
  
  const rawSignature = 
    `accessKey=${accessKey}&amount=${amount}&extraData=` +
    `&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}` +
    `&orderInfo=${orderInfo}&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
    `&redirectUrl=${process.env.MOMO_REDIRECT_URL}&requestId=${requestId}` +
    `&requestType=captureWallet`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const payload = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    partnerName: 'NiCueVN',
    partnerUserID: `USER${userId}`,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    ipnUrl: process.env.MOMO_IPN_URL,
    lang: 'vi',
    autoCapture: true,
    extraData: Buffer.from(JSON.stringify({
      userId: userId,
      productName: 'Nạp tiền NiCueVN'
    })).toString('base64'),
    requestType: 'captureWallet',
    signature: signature
  };

  try {
    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/create',
      payload
    );

    return response.data.payUrl;
  } catch (error) {
    console.error('Momo error:', error);
    throw error;
  }
};
```

### 2.3 IPN Callback

```javascript
app.post('/api/payment/momo/callback', async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      signature
    } = req.body;

    // Verify signature
    const verifySignature = await verifyMomoSignature(
      {
        partnerCode,
        orderId,
        amount,
        transId,
        resultCode
      },
      signature
    );

    if (!verifySignature) {
      return res.status(400).json({ success: false });
    }

    // resultCode: 0 = success
    if (resultCode === 0) {
      const [order] = await conn.query(
        'SELECT userId FROM orders WHERE order_code = ?',
        [orderId]
      );

      if (order.length > 0) {
        await conn.query(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [amount, order[0].userId]
        );

        await conn.query(
          'INSERT INTO transactions (userId, amount, paymentMethod, status, bankReference) VALUES (?, ?, ?, ?, ?)',
          [order[0].userId, amount, 'momo', 'completed', transId]
        );
      }
    }

    res.json({ success: resultCode === 0 });
  } catch (error) {
    console.error('IPN callback error:', error);
    res.status(500).json({ success: false });
  }
});
```

---

## 3️⃣ Bank Transfer

### 3.1 Setup

Bank transfer không cần API integration vì làm thủ công. Cần setup:

1. **Bank Account Info** (lưu trong database hoặc .env)
2. **Reference Format** (nội dung chuyển khoản)
3. **Manual Verification** (hoặc dùng API nếu bank hỗ trợ)

### 3.2 Implementation

```javascript
// Display bank info to user
const getBankInfo = () => {
  return {
    bankName: 'Vietcombank',
    accountNumber: '1234567890123',
    accountName: 'NICUEVN CO LTD',
    branch: 'TP Ho Chi Minh',
    content: (userId) => `NiCueVN USER_${userId}`
  };
};

// Generate QR Code (optional)
const generateBankQR = (amount, content) => {
  // Using library like "vietqr" to generate
  return `https://qr.vietcombank.vn/generate?amount=${amount}&content=${content}`;
};
```

### 3.3 Manual Verification

```javascript
// Cron job to check bank statements
const checkBankTransfers = async () => {
  // This requires:
  // 1. Bank API access
  // 2. Or manual upload of bank statement
  // 3. Parse and match reference code
  
  const pendingTransactions = await conn.query(
    'SELECT * FROM transactions WHERE status = "pending" AND paymentMethod = "bank"'
  );

  // Match against bank statement
  for (const tx of pendingTransactions) {
    const reference = `NiCueVN USER_${tx.userId}`;
    const bankMatch = await findInBankStatement(reference, tx.amount);
    
    if (bankMatch) {
      await conn.query(
        'UPDATE transactions SET status = "completed", bankReference = ? WHERE id = ?',
        [bankMatch.reference, tx.id]
      );
      
      await conn.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [tx.amount, tx.userId]
      );
    }
  }
};
```

---

## 4️⃣ Wallet Balance System

### 4.1 Add Balance

```javascript
const addBalance = async (userId, amount, method, reference) => {
  const conn = await pool.getConnection();
  
  try {
    await conn.beginTransaction();
    
    // Update user balance
    await conn.query(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [amount, userId]
    );
    
    // Log transaction
    await conn.query(
      'INSERT INTO transactions (userId, amount, paymentMethod, status, bankReference, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, amount, method, 'completed', reference]
    );
    
    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
```

### 4.2 Spend Balance (Purchase)

```javascript
const spendBalance = async (userId, amount, orderId) => {
  const conn = await pool.getConnection();
  
  try {
    await conn.beginTransaction();
    
    // Check sufficient balance
    const [user] = await conn.query(
      'SELECT balance FROM users WHERE id = ?',
      [userId]
    );
    
    if (user[0].balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Deduct balance
    await conn.query(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, userId]
    );
    
    // Update order
    await conn.query(
      'UPDATE orders SET status = "paid" WHERE id = ?',
      [orderId]
    );
    
    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
```

---

## 5️⃣ Security Best Practices

### 5.1 Signature Verification

```javascript
const verifyPaymentSignature = (data, signature, secretKey) => {
  const rawData = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(rawData)
    .digest('hex');

  return hash === signature;
};
```

### 5.2 Transaction Logging

```javascript
// Log every payment attempt
const logPaymentAttempt = async (userId, amount, method, status) => {
  await conn.query(
    'INSERT INTO payment_logs (userId, amount, method, status, ip_address, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
    [userId, amount, method, status, req.ip]
  );
};
```

### 5.3 Rate Limiting

```javascript
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 payment requests per hour
  message: 'Quá nhiều yêu cầu thanh toán, vui lòng thử lại sau'
});

app.post('/api/payment/process', paymentLimiter, (req, res) => {
  // Payment handler
});
```

---

## 6️⃣ Frontend Implementation

### 6.1 Payment Page

```jsx
// pages/payment.jsx
const [method, setMethod] = useState(null);
const [amount, setAmount] = useState(0);

const initiatePayment = async () => {
  try {
    const response = await api.post('/api/payment/process', {
      amount,
      paymentMethod: method
    });

    if (response.data.paymentUrl) {
      // Redirect to payment gateway
      window.location.href = response.data.paymentUrl;
    } else {
      // Show bank info
      showBankInfo(response.data.bankInfo);
    }
  } catch (error) {
    showError(error.message);
  }
};
```

### 6.2 Payment Callback Page

```jsx
// pages/payment/callback.jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get('transactionId');
  const status = params.get('status');

  if (status === 'success') {
    showSuccess('Thanh toán thành công!');
    setTimeout(() => navigate('/account/wallet'), 2000);
  } else {
    showError('Thanh toán thất bại. Vui lòng thử lại.');
  }
}, []);
```

---

## 📝 Environment Variables Checklist

```env
# Card Payment
VIETTEL_API_KEY=
MOBI_API_KEY=
VINA_API_KEY=

# Momo
MOMO_PARTNER_CODE=
MOMO_API_KEY=
MOMO_SECRET_KEY=
MOMO_REDIRECT_URL=http://localhost:3000/payment/callback
MOMO_IPN_URL=http://localhost:5000/api/payment/momo/callback

# Bank Info
BANK_NAME=Vietcombank
BANK_ACCOUNT_NUMBER=
BANK_ACCOUNT_NAME=NICUEVN CO LTD
BANK_BRANCH=
```

---

## 🧪 Testing Payments

### Test Cards (if supported)
- Visa: 4111 1111 1111 1111
- Mastercard: 5555 5555 5555 4444

### Test Momo (Sandbox)
```
Phone: 0987654321
Password: 123456
Amount: Any
```

---

## 🚨 Common Issues

### Issue: Signature verification failed
**Solution**: Check secret key and signature generation order

### Issue: Callback not received
**Solution**: Verify callback URL is accessible from internet

### Issue: Transaction not credited
**Solution**: Check database transaction table for errors

---

## 📞 Support Links

- Momo: https://developers.momo.vn
- Viettel: https://viettel.vn/business
- Mobi: https://mobi.vn/partner
- Vina: https://vina.vn/business

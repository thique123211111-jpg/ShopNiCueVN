# API Documentation - NiCueVN

## Base URL
```
http://localhost:5000/api
```

## Authentication
Sử dụng JWT Bearer Token trong header:
```
Authorization: Bearer {token}
```

---

## 📝 Authentication API

### 1. Register
**POST** `/auth/register`

Request:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "balance": 0
  }
}
```

### 2. Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "balance": 500000
  }
}
```

### 3. Get Profile
**GET** `/auth/profile`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "balance": 500000,
    "created_at": "2024-04-16T10:00:00Z"
  }
}
```

---

## 🛍️ Products API

### 1. Get Products List
**GET** `/products?game=1&minPrice=100000&maxPrice=500000&rank=Diamond&sortBy=newest&limit=20&offset=0`

Query Parameters:
- `game` - Game ID
- `minPrice` - Giá tối thiểu
- `maxPrice` - Giá tối đa
- `rank` - Rank (Diamond, Platinum, Gold)
- `sortBy` - Sắp xếp (newest, price-asc, price-desc)
- `limit` - Số sản phẩm (mặc định 20)
- `offset` - Vị trí bắt đầu

Response:
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "game": "Free Fire",
      "accountId": "player_001",
      "rank": "Diamond",
      "level": 45,
      "skinsCount": 12,
      "originalPrice": 500000,
      "discountedPrice": 450000,
      "discount": 10,
      "inStock": true,
      "sales": 25
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 2. Get Product Detail
**GET** `/products/{id}`

Response:
```json
{
  "success": true,
  "product": {
    "id": 1,
    "game": "Free Fire",
    "accountId": "player_001",
    "accountPassword": "pass123",
    "rank": "Diamond",
    "level": 45,
    "skinsCount": 12,
    "originalPrice": 500000,
    "discountedPrice": 450000,
    "discount": 10,
    "inStock": true,
    "description": "Tài khoản Free Fire cao rank",
    "images": ["url1", "url2"],
    "sales": 25,
    "rating": 4.5
  }
}
```

---

## 💳 Payment API

### 1. Process Payment
**POST** `/payment/process`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "amount": 500000,
  "paymentMethod": "card|momo|bank",
  "bankCode": "viettel|mobi|vina"
}
```

Response:
```json
{
  "success": true,
  "message": "Tạo yêu cầu thanh toán thành công",
  "transactionId": 123,
  "paymentUrl": "https://payment-gateway.example.com/charge/xxx"
}
```

### 2. Payment Callback
**POST** `/payment/callback`

Request (từ payment gateway):
```json
{
  "transactionId": 123,
  "status": "success|failed",
  "amount": 500000
}
```

Response:
```json
{
  "success": true,
  "message": "Thanh toán thành công"
}
```

### 3. Get Transaction History
**GET** `/payment/history/{userId}?limit=20&offset=0`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "userId": 1,
      "amount": 500000,
      "paymentMethod": "card",
      "status": "completed",
      "created_at": "2024-04-16T10:00:00Z"
    }
  ]
}
```

---

## 🛒 Orders API

### Create Order
**POST** `/orders`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": 1,
    "order_code": "ORD-2024-0001",
    "status": "processing",
    "items": [...],
    "total_amount": 450000
  }
}
```

---

## 🎯 Games API

### Get Games List
**GET** `/games`

Response:
```json
{
  "success": true,
  "games": [
    {
      "id": 1,
      "name": "Free Fire",
      "icon": "url",
      "category": "game"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Vui lòng cung cấp đủ thông tin"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy tài nguyên"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Lỗi server"
}
```

---

## 🔐 Security Headers

Tất cả response sẽ có headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## 📊 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Số request tối đa
  - `X-RateLimit-Remaining`: Số request còn lại
  - `X-RateLimit-Reset`: Thời gian reset

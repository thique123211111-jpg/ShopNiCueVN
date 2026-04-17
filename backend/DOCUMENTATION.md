# Backend Documentation - NiCueVN

## 📁 Project Structure

```
backend/
├── server.js              # Main application file
├── package.json          # Dependencies
├── .env.example          # Environment template
├── API.md                # API documentation
├── config/
│   └── database.js       # MySQL connection pool
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product routes
│   ├── payment.js       # Payment routes
│   ├── orders.js        # Order routes
│   ├── cart.js          # Cart routes
│   ├── users.js         # User routes
│   ├── admin.js         # Admin routes
│   └── games.js         # Game routes
├── controllers/          # Business logic
│   ├── authController.js
│   ├── productController.js
│   └── paymentController.js
├── middleware/           # Custom middleware
│   └── auth.js          # JWT verification
├── utils/               # Helper functions
│   ├── jwt.js           # JWT utilities
│   └── password.js      # Password hashing
└── database/
    └── schema.sql       # Database schema
```

## 🛠️ Installation

### 1. Setup

```bash
cd backend
cp .env.example .env
npm install
```

### 2. Database Setup

```bash
mysql -u root -p < ../database/schema.sql
```

### 3. Environment Variables

Edit `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nicuevn_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Payment APIs
VIETTEL_API_KEY=your_key
MOBI_API_KEY=your_key
VINA_API_KEY=your_key
MOMO_API_KEY=your_key
MOMO_PARTNER_CODE=your_code
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📦 Dependencies

- **express**: Web framework
- **mysql2**: MySQL client
- **dotenv**: Environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **joi**: Input validation
- **axios**: HTTP client for payment APIs
- **helmet**: Security headers
- **morgan**: HTTP logging
- **express-rate-limit**: Rate limiting

## 🔐 Security

### 1. Password Hashing
```javascript
const { hashPassword, comparePassword } = require('./utils/password');

// Hash on registration
const hashed = await hashPassword(plainPassword);

// Verify on login
const isValid = await comparePassword(plainPassword, hashed);
```

### 2. JWT Authentication
```javascript
// Generate token
const token = generateToken(userId);

// Verify token
const decoded = verifyToken(token);
```

### 3. Middleware Protection
All protected routes use `authMiddleware`:
```javascript
router.get('/profile', authMiddleware, controller.getProfile);
```

### 4. SQL Injection Prevention
Use parameterized queries:
```javascript
const [users] = await conn.query(
  'SELECT * FROM users WHERE email = ?',
  [email]  // Parameter is escaped
);
```

### 5. Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

## 💳 Payment System

### Architecture
1. User initiates payment
2. Backend creates transaction record
3. Calls appropriate payment gateway
4. Returns payment URL/info
5. Payment gateway redirects to callback
6. Backend verifies and credits balance

### Payment Methods

#### 1. Card (Viettel, Mobi, Vina)
- Integrates with telecom APIs
- Returns payment gateway URL
- Auto-charges on success

#### 2. Momo
- Creates Momo payment link
- User scans QR code
- Webhook confirms payment
- System credits balance

#### 3. Bank Transfer
- Displays bank info
- User transfers with reference
- Manual verification (1-3 min)
- System credits on match

## 📊 Database Schema

### Users Table
- Stores user accounts with bcrypt hashed passwords
- Balance field for wallet
- OAuth provider info for social login

### Products Table
- Game account listings
- Price, discount, rank, skins info
- Stock status
- Image URLs

### Orders Table
- Purchase records
- Links user to product
- Tracks delivery status
- Stores account credentials

### Transactions Table
- Payment history
- Amount, method, status
- Bank reference codes

### Services Table
- Service offerings
- Types: farm, items, upgrade, boost

### Minigame Results
- Lucky spin, card flip, lucky draw results
- Prize tracking

## 🔄 API Endpoints

See `API.md` for detailed endpoint documentation.

### Key Routes

**Authentication**
- `POST /api/auth/register` - New user signup
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

**Products**
- `GET /api/products` - List with filters
- `GET /api/products/:id` - Single product

**Payment**
- `POST /api/payment/process` - Initiate payment
- `POST /api/payment/callback` - Payment gateway callback
- `GET /api/payment/history/:userId` - Transaction history

## 🚀 Deployment

### Production Build
```bash
npm run build  # if using TypeScript
NODE_ENV=production npm start
```

### Environment
- Use strong JWT_SECRET
- Set NODE_ENV=production
- Configure proper database
- Setup payment API keys
- Use HTTPS
- Setup rate limiting

## 🐛 Error Handling

All endpoints return consistent format:
```json
{
  "success": false,
  "message": "Lỗi mô tả",
  "error": {}  // Only in development
}
```

## 📝 Logging

Uses `morgan` for HTTP logging:
- Combined format in production
- Detailed in development

## 🔧 Development Tips

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Get Profile with Token
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📖 Code Examples

### Creating Protected Route
```javascript
const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/action', authMiddleware, async (req, res) => {
  const userId = req.userId; // From middleware
  // Handle request
});

module.exports = router;
```

### Database Query
```javascript
const pool = require('../config/database');

const [rows] = await conn.query(
  'SELECT * FROM products WHERE game_id = ? AND price < ?',
  [gameId, maxPrice]
);
```

## 🎯 Next Steps

1. Implement cart management
2. Add order processing
3. Complete payment integrations
4. Build admin panel endpoints
5. Add email notifications
6. Implement search/filters
7. Add review system
8. Setup cron jobs for auto-delivery

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [JWT.io](https://jwt.io/)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

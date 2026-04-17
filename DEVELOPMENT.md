# 🛠️ Development Guide - NiCueVN

Hướng dẫn phát triển và mở rộng hệ thống NiCueVN.

---

## 📖 Table of Contents

1. [Environment Setup](#environment-setup)
2. [Folder Structure](#folder-structure)
3. [Code Standards](#code-standards)
4. [Adding Features](#adding-features)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🖥️ Environment Setup

### Prerequisites
```
Node.js: 16.x or higher
npm: 7.x or higher
MySQL: 5.7 or higher
Git: latest
```

### Install Dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### Environment Variables

**Backend** (`.env`)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nicuevn_db

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Payment (Add your keys)
VIETTEL_API_KEY=
MOBI_API_KEY=
VINA_API_KEY=
MOMO_API_KEY=
MOMO_PARTNER_CODE=
```

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_FACEBOOK_APP_ID=
```

---

## 📁 Folder Structure

### Backend Structure

```
backend/
├── server.js                 # Main entry point
├── package.json              # Dependencies
├── .env                      # Config (git-ignored)
├── API.md                    # API documentation
├── DOCUMENTATION.md          # Full documentation
│
├── config/
│   └── database.js          # MySQL connection
│
├── routes/                  # API endpoints
│   ├── auth.js             # /api/auth
│   ├── products.js         # /api/products
│   ├── payment.js          # /api/payment
│   ├── orders.js           # /api/orders
│   ├── users.js            # /api/users
│   ├── cart.js             # /api/cart
│   ├── games.js            # /api/games
│   └── admin.js            # /api/admin
│
├── controllers/            # Business logic
│   ├── authController.js   # Auth functions
│   ├── productController.js # Product functions
│   └── paymentController.js # Payment functions
│
├── middleware/             # Custom middleware
│   └── auth.js            # JWT verification
│
└── utils/                 # Helper functions
    ├── jwt.js            # Token utilities
    └── password.js       # Password hashing
```

### Frontend Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.jsx           # Home page
│   ├── layout.jsx         # Root layout
│   ├── globals.css        # Global styles
│   │
│   ├── login/
│   │   └── page.jsx       # Login page
│   ├── register/
│   │   └── page.jsx       # Register page
│   ├── account/
│   │   └── page.jsx       # Account dashboard
│   ├── cart/
│   │   └── page.jsx       # Shopping cart
│   └── admin/
│       └── page.jsx       # Admin dashboard
│
├── components/             # React components
│   ├── Header.jsx         # Top navigation
│   ├── Footer.jsx         # Bottom section
│   ├── Sidebar.jsx        # Filters
│   └── ProductCard.jsx    # Product card
│
├── lib/                   # Utilities
│   ├── api.js            # Axios instance
│   └── auth.js           # Auth helpers
│
├── styles/
│   └── globals.css       # Global styles
│
├── public/               # Static files
│   └── images/          # Image assets
│
├── package.json          # Dependencies
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind config
└── .env.local           # Config (git-ignored)
```

---

## 📝 Code Standards

### JavaScript/TypeScript Standards

**Naming Conventions**
```javascript
// Constants: UPPER_SNAKE_CASE
const API_URL = 'http://localhost:5000';

// Functions: camelCase
const getUserData = () => { };
const calculateTotal = (items) => { };

// Classes/Components: PascalCase
class UserService { }
function ProductCard() { }

// Variables: camelCase
let userBalance = 0;
const isLoggedIn = true;
```

**Code Structure**
```javascript
// Always use const by default
const value = 'something';

// Import order: stdlib, packages, local
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// Error handling
try {
  // code
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false });
}
```

### Frontend Components

```jsx
'use client'; // Always add for interactive components

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ComponentName() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  const handleAction = () => {
    // Event handlers
  };
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Backend Controllers

```javascript
exports.functionName = async (req, res) => {
  try {
    // Validate input
    const { required } = req.body;
    if (!required) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Database operation
    const conn = await pool.getConnection();
    const [result] = await conn.query('SELECT ...');
    conn.release();
    
    // Success response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    // Error response
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

---

## ✨ Adding Features

### Add New API Endpoint

**1. Create Route** (`backend/routes/feature.js`)
```javascript
const express = require('express');
const featureController = require('../controllers/featureController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, featureController.create);
router.get('/:id', featureController.get);

module.exports = router;
```

**2. Create Controller** (`backend/controllers/featureController.js`)
```javascript
exports.create = async (req, res) => {
  try {
    // Implementation
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.get = async (req, res) => {
  try {
    // Implementation
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
```

**3. Register in server.js**
```javascript
const featureRoutes = require('./routes/feature');
app.use('/api/feature', featureRoutes);
```

### Add New Frontend Page

**1. Create Page File** (`frontend/app/feature/page.jsx`)
```jsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import api from '@/lib/api';

export default function FeaturePage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await api.get('/api/feature');
      setData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <>
      <Header />
      <main className="container py-8">
        {/* Content */}
      </main>
      <Footer />
    </>
  );
}
```

**2. Add Navigation Link** (in `Header.jsx`)
```jsx
<Link href="/feature">Feature</Link>
```

### Add New Database Table

**1. Create SQL Migration**
```sql
CREATE TABLE IF NOT EXISTS new_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

**2. Run Migration**
```bash
mysql -u root -p nicuevn_db < migration.sql
```

**3. Update Backend Code** (in controllers/models)
```javascript
const [result] = await conn.query(
  'SELECT * FROM new_table WHERE userId = ?',
  [userId]
);
```

---

## 🧪 Testing

### Manual Testing Checklist

```
[ ] User Registration
[ ] User Login
[ ] View Products
[ ] Filter Products
[ ] Add to Cart
[ ] Remove from Cart
[ ] Checkout
[ ] Payment Processing
[ ] View Order History
[ ] Update Profile
[ ] Change Password
[ ] Admin Dashboard
[ ] Admin Add Product
[ ] Admin View Stats
```

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123","confirmPassword":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"

# Get Products
curl http://localhost:5000/api/products

# Get Products with Filter
curl "http://localhost:5000/api/products?game=1&minPrice=100000&maxPrice=500000"
```

### Browser DevTools

**Network Tab**
- Monitor API requests
- Check response status
- Verify headers

**Console Tab**
- Check for errors
- Test API calls
- Debug state

**Storage Tab**
- View localStorage
- Check cookies
- Debug tokens

---

## 🚀 Deployment

### Production Checklist

```
[ ] Environment variables set
[ ] JWT_SECRET changed
[ ] Database backups enabled
[ ] HTTPS configured
[ ] Rate limiting enabled
[ ] CORS configured properly
[ ] Error logging setup
[ ] Database indexed
[ ] Payment APIs configured
[ ] Email notifications setup
```

### Deploy to Heroku (Example)

**Backend**
```bash
cd backend
heroku login
heroku create nicuevn-api
heroku config:set DB_HOST=xxx DB_USER=xxx
git push heroku main
heroku logs --tail
```

**Frontend**
```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or similar
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Cannot connect to database**
```bash
# Check MySQL status
mysql -u root -p -e "SELECT 1"

# Check connection in backend
cd backend
node -e "require('./config/database')"
```

**Issue: Port already in use**
```bash
# Find process on port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

**Issue: Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue: CORS errors**
```javascript
// Check CORS config in server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Issue: Token expired**
```bash
# Clear cookies and localStorage
# Try login again
```

### Debug Logging

**Backend**
```javascript
// Add debug logs
console.log('DEBUG:', req.body);
console.log('User ID:', req.userId);
console.log('Query:', query);
```

**Frontend**
```javascript
// Use React DevTools
// Check Network tab for API calls
// View Console for errors
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Docs](https://dev.mysql.com/doc)
- [JWT.io](https://jwt.io/introduction)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Git](https://git-scm.com/) - Version control

---

## 🎯 Best Practices

1. **Always use prepared statements** to prevent SQL injection
2. **Hash passwords** with bcryptjs before storing
3. **Validate input** on both frontend and backend
4. **Use environment variables** for sensitive data
5. **Add error handling** with try-catch blocks
6. **Log important events** for debugging
7. **Use HTTPS** in production
8. **Keep dependencies updated** regularly
9. **Write comments** for complex logic
10. **Test thoroughly** before deployment

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Add feature: description"

# Push to remote
git push origin feature/feature-name

# Create Pull Request on GitHub
```

---

## 📞 Getting Help

1. Check documentation files
2. Search GitHub issues
3. Check terminal logs
4. Ask in community forums
5. Email support

---

**Happy Developing! 🚀**

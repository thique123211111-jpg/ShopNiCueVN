# 🚀 NiCueVN - Installation & Setup Guide

Hướng dẫn cài đặt và chạy hệ thống NiCueVN trên máy tính của bạn.

## 📋 Requirements

### Phần Mềm Cần Cài Đặt

- **Node.js**: >= 16.x (Download từ https://nodejs.org)
- **MySQL**: >= 5.7 (Download từ https://www.mysql.com/downloads/mysql/)
- **Git**: (Optional, để clone repository)

### Kiểm Tra Cài Đặt

```bash
node --version      # v16.x hoặc cao hơn
npm --version       # 7.x hoặc cao hơn
mysql --version     # 5.7 hoặc cao hơn
```

## 📂 Project Layout

```
ShopNiCueVN/
├── frontend/        # Next.js application (port 3000)
├── backend/         # Express API (port 5000)
├── database/        # MySQL schemas
└── README.md        # Project info
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Tạo Database

Mở MySQL command line hoặc MySQL Workbench:

```sql
-- Tạo database
CREATE DATABASE nicuevn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chọn database
USE nicuevn_db;
```

### 1.2 Import Schema

**Option A: Command Line**
```bash
mysql -u root -p nicuevn_db < database/schema.sql
```

**Option B: MySQL Workbench**
1. File > Open SQL Script
2. Chọn `database/schema.sql`
3. Click Execute

**Option C: phpMyAdmin**
1. Vào Import tab
2. Upload `database/schema.sql`
3. Click "Go"

### 1.3 Verify Database

```sql
USE nicuevn_db;
SHOW TABLES;  -- Sẽ hiển thị 12 tables
```

---

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

Expected: ~200 packages installed

### 2.3 Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Để trống nếu không có password
DB_NAME=nicuevn_db
JWT_SECRET=your-super-secret-jwt-key-12345
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 2.4 Start Backend Server

```bash
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
📡 API base URL: http://localhost:5000/api
```

### 2.5 Test Backend

```bash
# In another terminal
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"..."}
```

---

## 💻 Step 3: Frontend Setup

### 3.1 Navigate to Frontend

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

Expected: ~350 packages installed

### 3.3 Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### 3.4 Start Frontend Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

### 3.5 Access Frontend

Open browser: http://localhost:3000

---

## ✅ Verification Checklist

### Backend Check
- [ ] Terminal shows "Server running on http://localhost:5000"
- [ ] `curl http://localhost:5000/health` returns 200
- [ ] Database connected (no connection errors)

### Frontend Check
- [ ] Terminal shows "Local: http://localhost:3000"
- [ ] Browser loads home page
- [ ] Header with logo and search bar visible
- [ ] Can scroll through products

### Database Check
```bash
mysql -u root -p
USE nicuevn_db;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as product_count FROM products;
```

---

## 🧪 Testing Features

### 1. User Registration

1. Go to http://localhost:3000/register
2. Fill form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Đăng Ký"
4. Should redirect to home page

### 2. User Login

1. Go to http://localhost:3000/login
2. Enter credentials from registration
3. Click "Đăng Nhập"
4. Header should show username & balance

### 3. View Products

1. Go to home page
2. Scroll to "Nick Ngon Giá Rẻ" section
3. See product cards with:
   - Product image placeholder
   - Account ID
   - Price
   - Discount badge
   - "Mua Ngay" button

### 4. Add to Cart

1. Click "Mua Ngay" on any product
2. Should see "Đã thêm vào giỏ hàng"
3. Go to http://localhost:3000/cart
4. Product should be in cart

### 5. Admin Dashboard

1. Go to http://localhost:3000/admin
2. See statistics:
   - Tổng Doanh Thu
   - Tổng Đơn Hàng
   - Tổng Người Dùng
   - Tổng Sản Phẩm

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Check port
netstat -an | grep 3306

# Restart MySQL service
# Windows: net start MySQL80
# Mac: brew services restart mysql
# Linux: sudo service mysql restart
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: 
lsof -i :5000
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: npm packages not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot find module"

**Solution:**
```bash
# In the affected folder (backend or frontend)
npm install

# If still failing, try:
npm ci
```

---

## 📝 File Modifications

### Important Files to Configure

1. **backend/.env**
   - Database credentials
   - JWT secret
   - Payment API keys

2. **frontend/.env.local**
   - Backend API URL
   - OAuth credentials

3. **database/schema.sql**
   - Create tables if first run
   - Import sample data

---

## 🔄 Development Workflow

### Start Everything

**Terminal 1: Database**
```bash
# Just ensure MySQL is running
mysql -u root -p
```

**Terminal 2: Backend**
```bash
cd backend
npm run dev
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```

Now visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

---

## 🚀 Building for Production

### Backend

```bash
cd backend
npm run build  # if using TypeScript
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

---

## 📚 Documentation

- Frontend Docs: `frontend/DOCUMENTATION.md`
- Backend Docs: `backend/DOCUMENTATION.md`
- API Docs: `backend/API.md`
- Database Docs: `database/README.md`

---

## 🤝 Support

If you encounter any issues:

1. Check the logs in terminal
2. Verify MySQL is running
3. Check ports are not blocked
4. Ensure .env files are configured
5. Clear npm cache and reinstall

---

## 📞 Contact

- Email: support@nicuevn.com
- GitHub Issues: Create an issue on repository

---

## ✨ Next Steps After Setup

1. **Database**: Sample data is auto-imported (4 games, 4 products)
2. **Authentication**: Test register & login
3. **Products**: Browse and add to cart
4. **Admin Panel**: Check statistics
5. **Payment**: (Setup payment API keys)
6. **Services**: Deploy and monitor

Enjoy building NiCueVN! 🎉

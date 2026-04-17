# 🚀 Deploy Vercel + Railway - Step by Step

## 📍 **PHASE 1: Deploy Frontend → Vercel** (10 phút)

### **Step 1: Tạo GitHub Repository**

1. Vào: https://github.com/new
2. Tạo repo tên: `ShopNiCueVN`
3. ✅ Public
4. ❌ Không khởi tạo README (dùng local)

### **Step 2: Push Code Lên GitHub**

**Mở PowerShell, chạy:**

```powershell
cd c:\Users\NGUYEN HOAI TRAN\Downloads\ShopNiCueVN

# Khởi tạo git
git init
git add .
git commit -m "Initial commit - Full stack shop"

# Thêm remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ShopNiCueVN.git

# Push lên
git branch -M main
git push -u origin main
```

**Thay `YOUR_GITHUB_USERNAME` bằng username GitHub của bạn!**

### **Step 3: Tạo Vercel Account**

1. Vào: https://vercel.com/signup
2. Click **Sign up with GitHub**
3. Authorize Vercel
4. ✅ Confirm email

### **Step 4: Deploy Frontend**

**Trong Vercel Dashboard:**

1. Click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Paste: `https://github.com/YOUR_GITHUB_USERNAME/ShopNiCueVN`
4. Click **Continue**
5. **Project Settings:**
   - Root Directory: `./frontend` ← **QUAN TRỌNG!**
   - Framework: `Next.js`
6. **Environment Variables** - Thêm những cái này:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDfItD3bNPbp_bQPHwRNVVRMIvIrmM3fYM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shopnicue.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shopnicue
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shopnicue.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=680156736322
NEXT_PUBLIC_FIREBASE_APP_ID=1:680156736322:web:39ff57c4780ed5b397f6db
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JMP8HJ8TZJ
```

7. Click **Deploy**
8. ⏳ Chờ 2-3 phút...
9. ✅ **Done!** URL: `https://shopnicuevn.vercel.app` (hoặc tương tự)

---

## 📍 **PHASE 2: Deploy Backend → Railway** (10 phút)

### **Step 1: Tạo Railway Account**

1. Vào: https://railway.app/
2. Click **Sign up**
3. Sign up with GitHub
4. Authorize Railway
5. ✅ Confirm email

### **Step 2: Deploy Backend**

**Trong Railway Dashboard:**

1. Click **New Project**
2. Click **Deploy from GitHub repo**
3. Paste: `https://github.com/YOUR_GITHUB_USERNAME/ShopNiCueVN`
4. Click **Continue**
5. **Select Root Directory**: `./backend` ← **QUAN TRỌNG!**
6. Click **Deploy Now**
7. ⏳ Chờ 2-3 phút...

### **Step 3: Cấu Hình Environment Railway**

**Khi deploy xong:**

1. Vào project Railway
2. Click **Variables** tab
3. Thêm environment variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopnicuevn
JWT_SECRET=your_secret_key_here
VIETTEL_API_KEY=your_key
MOBI_API_KEY=your_key
VINA_API_KEY=your_key
MOMO_API_KEY=your_key
```

4. Railway sẽ auto-assign URL, ví dụ: `https://backend-shopnicue.railway.app`
5. Copy URL này!

### **Step 4: Cập Nhật Frontend API URL**

1. Vào Vercel Dashboard
2. Project → Settings → **Environment Variables**
3. Chỉnh sửa: `NEXT_PUBLIC_API_URL`
4. Đổi từ: `http://localhost:5000`
5. Thành: `https://backend-shopnicue.railway.app` (URL Railway của bạn)
6. Click **Save**
7. ⏳ Vercel tự redeploy (1 phút)

---

## 📍 **PHASE 3: Setup Database → PlanetScale** (5 phút)

### **Step 1: Tạo PlanetScale Account**

1. Vào: https://planetscale.com/
2. Click **Sign up**
3. Sign up with GitHub
4. ✅ Confirm

### **Step 2: Tạo Database**

1. Click **Create a new database**
2. Name: `shopnicuevn`
3. Region: **Singapore** (gần Việt Nam)
4. ✅ Create database

### **Step 3: Import Schema**

1. Vào database
2. Click **Branches** → **main**
3. Click **Connect** button
4. Copy connection string (MySQL):

   ```
   mysql://[user]:[password]@[host]/shopnicuevn?ssl={"rejectUnauthorized":true}
   ```

5. Mở terminal, chạy:

   ```powershell
   mysql -u [user] -p [password] -h [host] shopnicuevn < database/schema.sql
   ```

6. ✅ Database setup xong!

### **Step 4: Update Railway MySQL Config**

1. Vào Railway project
2. Click **Variables**
3. Update:

   ```env
   DB_HOST=[planetscale_host]
   DB_USER=[planetscale_user]
   DB_PASSWORD=[planetscale_password]
   ```

4. Railway tự redeploy

---

## ✅ **Kết Quả Cuối Cùng**

```
Website Live:
┌─────────────────────────┐
│ Frontend: Vercel        │
│ shopnicuevn.vercel.app  │
└─────────────────────────┘
         ↓ API calls
┌─────────────────────────┐
│ Backend: Railway        │
│ shopnicue.railway.app   │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ Database: PlanetScale   │
│ MySQL Cloud             │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ Storage: Firebase       │
│ Images + Notifications  │
└─────────────────────────┘
```

---

## 🧪 **Test Website Live**

1. Truy cập: **https://shopnicuevn.vercel.app**
2. ✅ Trang chủ load
3. **Đăng ký**: email + password
4. **Đăng nhập**: test account
5. **Mua sản phẩm**: add to cart → checkout
6. **Admin**: /admin → upload ảnh Firebase

---

## ⚠️ **Troubleshooting**

### ❌ "Deployment Failed"

- Check logs: Vercel Dashboard → Deployments
- Kiểm tra: package.json, package-lock.json có hợp lệ

### ❌ "Cannot connect to database"

- Kiểm tra: DB_HOST, DB_USER, DB_PASSWORD đúng
- Railway MySQL variables đã set?

### ❌ "API calls failing"

- Kiểm tra: `NEXT_PUBLIC_API_URL` trong Vercel
- Kiểm tra: CORS trong backend

### ❌ "Images not loading"

- Firebase Storage Rules? (xem FIREBASE_SETUP.md)
- Permission sao?

---

## 📞 **Support**

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **PlanetScale Docs**: https://docs.planetscale.com

---

🎉 **Website của bạn đã live trên cloud!**

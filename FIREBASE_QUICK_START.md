# 🚀 Firebase Integration - Quick Start

## ✅ Cài đặt Hoàn Thành

- ✅ Firebase SDK cài vào frontend
- ✅ `lib/firebase.js` config tạo xong
- ✅ ImageUploader component tạo xong
- ✅ NotificationListener component tạo xong
- ✅ Admin Dashboard cập nhật (Firebase upload)
- ✅ `.env.example` cập nhật Firebase config

---

## 📋 Các Files Mới Tạo

```
frontend/
├── lib/firebase.js                    ← Firebase config & helpers
├── components/ImageUploader.jsx       ← Upload ảnh component
├── components/NotificationListener.jsx ← Notifications component
└── app/layout.jsx                     ← Updated (add NotificationListener)
└── app/admin/page.jsx                 ← Updated (add ImageUploader form)
└── .env.example                       ← Updated (Firebase config)

FIREBASE_SETUP.md                      ← Chi tiết setup guide
FIREBASE_QUICK_START.md                ← File này
```

---

## 🎯 Các Bước Tiếp Theo

### 1️⃣ Tạo `.env.local` 
```bash
cp frontend/.env.example frontend/.env.local
```

Kiểm tra `.env.local` có Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDfItD3bNPbp_bQPHwRNVVRMIvIrmM3fYM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shopnicue.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shopnicue
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shopnicue.firebasestorage.app
...
```

### 2️⃣ Chạy Frontend
```bash
cd frontend
npm install    # (nếu chưa chạy lần nào)
npm run dev
```

Truy cập: **http://localhost:3000**

### 3️⃣ Test Firebase Upload
1. Vào: **http://localhost:3000/admin**
2. Click **"🎮 Sản Phẩm"** tab
3. Click **"➕ Thêm Sản Phẩm"**
4. Scroll down → **"Upload Ảnh (Firebase)"** section
5. Click upload → Chọn ảnh → Firebase Storage lưu ảnh 🎉

### 4️⃣ Firebase Storage Setup (Tối Thiểu)
Để upload hoạt động, cần cấu hình **Firebase Storage Rules**:

1. Vào: https://console.firebase.google.com
2. Chọn **shopnicue** project
3. **Storage** → **Rules** tab
4. Paste code này:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
5. **Publish**

---

## 🌟 Tính Năng Đã Thêm

### 📸 Firebase Storage
- ✅ Upload ảnh sản phẩm
- ✅ Lưu URL trên Firebase
- ✅ Delete ảnh khi xóa sản phẩm

### 🔔 Firebase Cloud Messaging (tùy chọn)
- ✅ Setup: xem `FIREBASE_SETUP.md` section "Firebase Cloud Messaging Setup"
- ✅ Gửi thông báo real-time tới user
- ✅ Hiển thị thông báo dạng toast (notification-listener.jsx)

### 🔒 Security
- ✅ Chỉ user đăng nhập mới upload
- ✅ CORS tự động support (Firebase built-in)
- ✅ Storage Rules bảo vệ ảnh

---

## 📱 Demo Workflow

### Admin thêm sản phẩm:
```
1. Vào /admin → Sản Phẩm tab
2. Click "➕ Thêm Sản Phẩm"
3. Điền form:
   - Game: Free Fire
   - Account ID: FF123456
   - Rank: Titanium
   - Level: 50
   - Skins: 25
   - Giá: 500.000đ → 400.000đ
4. Upload ảnh → Firebase Storage
5. Click "💾 Lưu Sản Phẩm"
6. ✅ Sản phẩm lưu vào database
```

### User mua sản phẩm:
```
1. Vào /home → Xem sản phẩm (ảnh từ Firebase)
2. Click "Mua ngay" → Thêm giỏ hàng
3. /cart → Checkout → /login
4. Chọn thanh toán → Xác nhận
5. 🔔 Nhận notification từ Firebase
6. ✅ Nhận tài khoản
```

---

## 🔧 Troubleshooting

### ❌ "Cannot find module 'firebase'"
```bash
npm install firebase
```

### ❌ "Firebase is not initialized"
- Check `.env.local` có tất cả `NEXT_PUBLIC_FIREBASE_*` keys

### ❌ "Upload rejected / CORS error"
- Firebase Storage Rules chưa cấu hình
- Xem bước 4️⃣ ở trên

### ❌ "Notification permission denied"
- Browser yêu cầu user cho phép notification
- Chạy code: `Notification.requestPermission()`

---

## 📚 Tài Liệu

- **Chi tiết**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Firebase Console**: https://console.firebase.google.com
- **Storage Docs**: https://firebase.google.com/docs/storage
- **Messaging Docs**: https://firebase.google.com/docs/cloud-messaging

---

## 🎉 Done!

Firebase integration hoàn thành. Bạn có thể:
- ✅ Upload/download ảnh sản phẩm
- ✅ Gửi thông báo real-time
- ✅ Giữ MySQL + Express backend hiện tại

**Tiếp theo?** Tùy chọn:
1. **Deploy** (Vercel + Firebase)
2. **Thêm tính năng** (oauth, 2FA, etc)
3. **Setup payment** (Momo, card, bank)
4. **Test & optimize**

---

Hỏi nếu cần help! 🚀

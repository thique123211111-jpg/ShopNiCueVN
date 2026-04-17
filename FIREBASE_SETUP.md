# 🔥 Firebase Setup Guide - NiCueVN

## 📋 Table of Contents
1. [Cơ bản](#cơ-bản)
2. [Firebase Storage Setup](#firebase-storage-setup)
3. [Firebase Cloud Messaging Setup](#firebase-cloud-messaging-setup)
4. [Cấu hình môi trường](#cấu-hình-môi-trường)
5. [Testing](#testing)

---

## Cơ bản

NiCueVN tích hợp Firebase cho:
- **Firebase Storage**: Lưu ảnh sản phẩm
- **Firebase Cloud Messaging (FCM)**: Gửi thông báo
- **Express Backend + MySQL**: Vẫn dùng để quản lý tài khoản & đơn hàng

### ✅ Lợi ích
```
+ Giảm tải server (ảnh lưu trên Cloud)
+ Tăng tốc độ load ảnh (CDN global)
+ Gửi thông báo real-time
+ Không cần viết lại backend hiện tại
```

---

## Firebase Storage Setup

### Bước 1: Vào Firebase Console
1. Truy cập: https://console.firebase.google.com/
2. Chọn project: **shopnicue**
3. Vào **Storage** từ menu bên trái

### Bước 2: Tạo Storage Bucket
```
Location: Southeast Asia (singapore) - gần Việt Nam
Storage class: Standard
```

### Bước 3: Cấu hình Security Rules
Vào **Rules** tab, thay thế bằng:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read, authenticated write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Other uploads - protect better
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Lưu ý**: Rules này cho phép mọi người đọc ảnh sản phẩm, nhưng chỉ user đăng nhập mới upload

### Bước 4: Test Storage
1. Vào **Files** tab
2. Click **Upload file**
3. Chọn ảnh sản phẩm thử

---

## Firebase Cloud Messaging Setup

### Bước 1: Tạo Web Push Certificate
1. Vào **Project Settings** (⚙️ icon)
2. Chọn tab **Cloud Messaging**
3. Tìm section **Web Push certificates**
4. Click **Generate Key Pair**
5. Copy **Server Key** (sẽ dùng sau)

### Bước 2: Tạo Service Account
1. Vào **Project Settings**
2. Chọn tab **Service Accounts**
3. Click **Generate new private key**
4. Lưu file JSON này (dùng để gửi thông báo từ backend)

### Bước 3: Cấu hình Backend (tùy chọn)
Nếu muốn gửi thông báo từ backend:

```bash
# Backend setup
cd backend
npm install firebase-admin
```

**File**: `backend/utils/firebase-admin.js`
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

**Gửi thông báo**:
```javascript
const admin = require('../utils/firebase-admin');

const message = {
  notification: {
    title: 'Đơn hàng mới',
    body: 'Bạn có đơn hàng chờ xác nhận'
  },
  webpush: {
    fcmOptions: { link: 'https://yoursite.com/orders' }
  },
  topic: 'orders'
};

admin.messaging().send(message)
  .then(response => console.log('Sent:', response))
  .catch(error => console.log('Error:', error));
```

---

## Cấu hình môi trường

### Bước 1: Tạo `.env.local`
Sao chép `.env.example` và điền giá trị:

```bash
cp frontend/.env.example frontend/.env.local
```

**File**: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_id

# Firebase (đã có sẵn)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDfItD3bNPbp_bQPHwRNVVRMIvIrmM3fYM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shopnicue.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shopnicue
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shopnicue.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=680156736322
NEXT_PUBLIC_FIREBASE_APP_ID=1:680156736322:web:39ff57c4780ed5b397f6db
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JMP8HJ8TZJ
```

### Bước 2: Backend (nếu dùng messaging)
**File**: `backend/.env`
```env
FIREBASE_PROJECT_ID=shopnicue
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=... (từ serviceAccountKey.json)
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=...
FIREBASE_TOKEN_URI=...
```

---

## Testing

### 1️⃣ Test Upload Ảnh
Vào **Admin Dashboard**:
```
http://localhost:3000/admin
```

1. Click **Products** tab
2. Click **+ Add Product**
3. Upload ảnh → Firebase Storage
4. Verify ảnh xuất hiện

### 2️⃣ Test Cloud Messaging

**Frontend - Yêu cầu permission**:
```javascript
// Add to a button or auto-request
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification enabled');
    }
  }
}
```

**Backend - Gửi thông báo**:
```bash
curl -X POST http://localhost:5000/api/admin/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "body": "Đây là thông báo thử",
    "topic": "orders"
  }'
```

### 3️⃣ Verify Firebase Console
1. Vào https://console.firebase.google.com
2. **Storage** → Xem ảnh upload
3. **Cloud Messaging** → Xem statistics

---

## 🚀 Production Checklist

- [ ] Firebase Storage Rules đã cấu hình (public read, auth write)
- [ ] `.env.local` có Firebase config
- [ ] ImageUploader component hoạt động
- [ ] Test upload & download ảnh
- [ ] Cloud Messaging rules cấu hình
- [ ] Backend có Firebase Admin SDK (nếu cần)
- [ ] Database vẫn hoạt động bình thường

---

## 📞 Troubleshooting

### ❌ "Firebase is not initialized"
**Giải pháp**: Kiểm tra `NEXT_PUBLIC_*` variables trong `.env.local`

### ❌ "Storage bucket not found"
**Giải pháp**: Vào Firebase Console > Storage > Create bucket

### ❌ "CORS error uploading to Firebase"
**Giải pháp**: Kiểm tra Security Rules cho phép write từ frontend

### ❌ "Notifications not working"
**Giải pháp**:
1. User phải cho phép notification permission
2. Kiểm tra browser console có lỗi
3. Verify Firebase Messaging setup

---

## 📚 Tài liệu tham khảo
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Console](https://console.firebase.google.com)

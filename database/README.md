# NiCueVN Database Setup Guide

## 📋 Database Information

- **Database Name**: `nicuevn_db`
- **Database Type**: MySQL 5.7+
- **Encoding**: UTF8MB4

## 🚀 Setup Instructions

### 1. Using MySQL Command Line

```bash
mysql -u root -p < database/schema.sql
```

### 2. Using MySQL Workbench

1. Open MySQL Workbench
2. Create new connection if needed
3. Open `File > Open SQL Script`
4. Select `database/schema.sql`
5. Press `Execute` or `Ctrl+Shift+Enter`

### 3. Using phpMyAdmin

1. Go to phpMyAdmin
2. Click "Import" tab
3. Upload `database/schema.sql`
4. Click "Go"

## 📊 Database Tables

### Core Tables
- **users** - Người dùng
- **games** - Danh sách game
- **products** - Tài khoản game
- **orders** - Đơn hàng
- **cart** - Giỏ hàng
- **transactions** - Giao dịch thanh toán

### Service Tables
- **services** - Dịch vụ (cày thuê, mua vật phẩm)
- **service_orders** - Đơn hàng dịch vụ

### Feature Tables
- **minigame_results** - Kết quả mini-game
- **support_tickets** - Hỗ trợ khách hàng

### Admin Tables
- **admin_logs** - Logs quản lý

## 🔑 Sample Data

Schema tự động chèn dữ liệu mẫu:
- 4 game mẫu
- 4 tài khoản mẫu
- 4 dịch vụ mẫu

## 🔐 Security Notes

- Mật khẩu tài khoản được hash
- JWT tokens hết hạn sau 7 ngày
- SQL Injection protection qua prepared statements
- Rate limiting cho payment APIs

## 📝 Backup

```bash
mysqldump -u root -p nicuevn_db > backup.sql
```

## 🔄 Restore from Backup

```bash
mysql -u root -p nicuevn_db < backup.sql
```

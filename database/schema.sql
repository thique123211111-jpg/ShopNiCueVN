-- NiCueVN Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS nicuevn_db;
USE nicuevn_db;

-- ===== Users Table =====
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(12, 2) DEFAULT 0,
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(6),
  oauth_id VARCHAR(255),
  oauth_provider VARCHAR(50),
  last_login DATETIME,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- ===== Games Table =====
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== Products Table (Game Accounts) =====
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  accountId VARCHAR(255) NOT NULL UNIQUE,
  accountPassword VARCHAR(255) NOT NULL,
  rank VARCHAR(50),
  level INT,
  skinsCount INT DEFAULT 0,
  skinsList JSON,
  originalPrice DECIMAL(10, 2) NOT NULL,
  discountedPrice DECIMAL(10, 2),
  discount INT DEFAULT 0,
  inStock BOOLEAN DEFAULT TRUE,
  images JSON,
  description TEXT,
  sales INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  INDEX idx_game_id (game_id),
  INDEX idx_inStock (inStock),
  INDEX idx_price (originalPrice)
);

-- ===== Orders Table =====
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  account_delivered VARCHAR(255),
  account_password_delivered VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  delivery_time DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ===== Cart Table =====
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE KEY unique_cart (user_id, product_id),
  INDEX idx_user_id (user_id)
);

-- ===== Transactions Table =====
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50),
  bankCode VARCHAR(50),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  transaction_code VARCHAR(100) UNIQUE,
  bank_reference VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ===== Services Table =====
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  game_id INT,
  price DECIMAL(10, 2),
  type ENUM('farm', 'items', 'upgrade', 'boost') DEFAULT 'farm',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  INDEX idx_game_id (game_id)
);

-- ===== Service Orders Table =====
CREATE TABLE IF NOT EXISTS service_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  user_id INT NOT NULL,
  account_info VARCHAR(255),
  status ENUM('pending', 'processing', 'done') DEFAULT 'pending',
  progress INT DEFAULT 0,
  notes TEXT,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- ===== Minigame Results Table =====
CREATE TABLE IF NOT EXISTS minigame_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_type ENUM('lucky_spin', 'flip_card', 'lucky_draw') DEFAULT 'lucky_spin',
  prize_amount DECIMAL(10, 2),
  won_item VARCHAR(255),
  is_won BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===== Support Tickets Table =====
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- ===== Admin Logs Table =====
CREATE TABLE IF NOT EXISTS admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255),
  target_type VARCHAR(100),
  target_id INT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
);

-- ===== Insert Sample Games =====
INSERT IGNORE INTO games (name, description, icon_url, category, is_active, display_order) VALUES
('Free Fire', 'Game bắn súng hoàng tế mobile phổ biến', '/images/freefire.png', 'game', TRUE, 1),
('Liên Quân', 'Game MOBA hàng đầu châu Á', '/images/lienquan.png', 'game', TRUE, 2),
('Roblox', 'Nền tảng game sáng tạo', '/images/roblox.png', 'game', TRUE, 3),
('Liên Minh Huyền Thoại', 'Game MOBA thế giới từ Riot Games', '/images/lol.png', 'game', TRUE, 4);

-- ===== Insert Sample Products =====
INSERT IGNORE INTO products (game_id, accountId, accountPassword, rank, level, skinsCount, originalPrice, discountedPrice, discount, inStock, description) VALUES
(1, 'player_001', 'pass123', 'Diamond', 45, 12, 500000, 450000, 10, TRUE, 'Acc FF cao rank'),
(1, 'player_002', 'pass456', 'Platinum', 40, 8, 300000, 270000, 10, TRUE, 'Acc FF giá rẻ'),
(2, 'lq_master_001', 'pass789', 'Thách Đấu', 50, 20, 800000, 720000, 10, TRUE, 'Acc Liên Quân cao rank'),
(2, 'lq_player_002', 'passabc', 'Khỏa Thác', 35, 5, 200000, 180000, 10, TRUE, 'Acc Liên Quân beginner');

-- ===== Insert Sample Services =====
INSERT IGNORE INTO services (name, description, game_id, price, type, is_active) VALUES
('Cày FF Diamond', 'Cày thuê tài khoản FF lên rank Diamond', 1, 500000, 'farm', TRUE),
('Mua Skin FF', 'Mua thêm skin cho tài khoản FF', 1, 300000, 'items', TRUE),
('Cày Liên Quân', 'Cày thuê tài khoản Liên Quân', 2, 600000, 'farm', TRUE),
('Boost Rank', 'Nâng rank nhanh chóng', 2, 400000, 'boost', TRUE);

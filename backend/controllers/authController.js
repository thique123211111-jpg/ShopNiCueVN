const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đủ thông tin',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không khớp',
      });
    }

    const conn = await pool.getConnection();

    // Check if user already exists
    const [existingUser] = await conn.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      conn.release();
      return res.status(409).json({
        success: false,
        message: 'Email hoặc username đã tồn tại',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [result] = await conn.query(
      'INSERT INTO users (username, email, password, balance, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, hashedPassword, 0]
    );

    conn.release();

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: result.insertId,
        username,
        email,
        balance: 0,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký',
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mật khẩu',
      });
    }

    const conn = await pool.getConnection();

    const [users] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      conn.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      conn.release();
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    conn.release();

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập',
    });
  }
};

// Lấy profile
exports.getProfile = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [users] = await conn.query(
      'SELECT id, username, email, balance, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    conn.release();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin',
    });
  }
};

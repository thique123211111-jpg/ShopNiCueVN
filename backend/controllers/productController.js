const pool = require('../config/database');

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const { game, minPrice, maxPrice, rank, sortBy, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM products WHERE inStock = 1';
    const params = [];

    if (game) {
      query += ' AND game = ?';
      params.push(game);
    }

    if (minPrice) {
      query += ' AND originalPrice >= ?';
      params.push(parseInt(minPrice));
    }

    if (maxPrice) {
      query += ' AND originalPrice <= ?';
      params.push(parseInt(maxPrice));
    }

    if (rank) {
      query += ' AND rank = ?';
      params.push(rank);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      query += ' ORDER BY originalPrice ASC';
    } else if (sortBy === 'price-desc') {
      query += ' ORDER BY originalPrice DESC';
    } else if (sortBy === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY sales DESC';
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const conn = await pool.getConnection();
    const [products] = await conn.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE inStock = 1';
    const countParams = [];
    if (game) {
      countQuery += ' AND game = ?';
      countParams.push(game);
    }
    if (minPrice) {
      countQuery += ' AND originalPrice >= ?';
      countParams.push(parseInt(minPrice));
    }
    if (maxPrice) {
      countQuery += ' AND originalPrice <= ?';
      countParams.push(parseInt(maxPrice));
    }
    if (rank) {
      countQuery += ' AND rank = ?';
      countParams.push(rank);
    }

    const [countResult] = await conn.query(countQuery, countParams);
    conn.release();

    res.json({
      success: true,
      products,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy sản phẩm',
    });
  }
};

// Lấy chi tiết sản phẩm
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await pool.getConnection();
    const [products] = await conn.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    conn.release();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy sản phẩm',
    });
  }
};

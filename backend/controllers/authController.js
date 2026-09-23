const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPassword]
    );

    const token = generateToken(result.insertId);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: { id: result.insertId, name, email },
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// GET /api/auth/profile (protected)
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      message: 'Profile fetched',
      data: { user: rows[0] },
    });
  } catch (err) {
    console.error('Profile error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};
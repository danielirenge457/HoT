const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND role = 'admin'`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    
    // Verify password (for now, we'll use a simple check)
    // In production, compare hashed passwords
    if (password !== 'admin123') { // Default password - CHANGE THIS
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get admin dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM donations) as total_donations,
        (SELECT SUM(amount) FROM donations) as total_donated,
        (SELECT COUNT(*) FROM job_applications) as total_job_applications,
        (SELECT COUNT(*) FROM volunteer_applications) as total_volunteers,
        (SELECT COUNT(*) FROM subscriptions) as total_subscribers
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
              up.location, up.nationality, up.skills
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donations
router.get('/donations', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM donations ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all job applications
router.get('/job-applications', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ja.*, u.name, u.email FROM job_applications ja
       LEFT JOIN users u ON ja.user_id = u.id
       ORDER BY ja.applied_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all volunteer applications
router.get('/volunteers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM volunteer_applications ORDER BY applied_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete donation
router.delete('/donations/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM donations WHERE id = $1', [id]);
    res.json({ success: true, message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, verifyToken };

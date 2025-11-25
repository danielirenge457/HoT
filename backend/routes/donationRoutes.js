const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all donations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM donations ORDER BY created_at DESC LIMIT 100`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create donation
router.post('/', async (req, res) => {
  try {
    const { user_id, donor_name, donor_email, amount, currency, payment_method, transaction_id, message } = req.body;
    
    const result = await pool.query(
      `INSERT INTO donations (user_id, donor_name, donor_email, amount, currency, payment_method, payment_status, transaction_id, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [user_id, donor_name, donor_email, amount, currency, payment_method, 'completed', transaction_id, message]
    );
    
    res.json({ success: true, donation: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get donation statistics
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as total_donations, SUM(amount) as total_amount, AVG(amount) as avg_amount FROM donations`
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

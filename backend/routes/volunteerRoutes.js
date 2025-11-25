const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all volunteer applications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM volunteer_applications ORDER BY applied_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create volunteer application
router.post('/', async (req, res) => {
  try {
    const { user_id, full_name, email, phone, date_of_birth, address, city, country, nationality, education_level, skills, availability, motivation } = req.body;
    
    const result = await pool.query(
      `INSERT INTO volunteer_applications (user_id, full_name, email, phone, date_of_birth, address, city, country, nationality, education_level, skills, availability, motivation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [user_id, full_name, email, phone, date_of_birth, address, city, country, nationality, education_level, skills, availability, motivation]
    );
    
    res.json({ success: true, application: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update volunteer application status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      `UPDATE volunteer_applications SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json({ success: true, application: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

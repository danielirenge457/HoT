const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all job applications
router.get('/', async (req, res) => {
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

// Create job application
router.post('/', async (req, res) => {
  try {
    const { user_id, job_id, job_title, department, cover_letter, cv_url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO job_applications (user_id, job_id, job_title, department, cover_letter, cv_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, job_id, job_title, department, cover_letter, cv_url]
    );
    
    res.json({ success: true, application: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      `UPDATE job_applications SET application_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json({ success: true, application: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

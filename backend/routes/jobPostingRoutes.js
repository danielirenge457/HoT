const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all job postings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM job_postings WHERE status = 'open' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job posting by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM job_postings WHERE id = $1`,
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job posting
router.post('/', async (req, res) => {
  try {
    const { title, department, description, roles_responsibilities, qualifications_skills, opening_date, deadline_date } = req.body;
    
    const result = await pool.query(
      `INSERT INTO job_postings (title, department, description, roles_responsibilities, qualifications_skills, opening_date, deadline_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, department, description, roles_responsibilities, qualifications_skills, opening_date, deadline_date]
    );
    
    res.json({ success: true, job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

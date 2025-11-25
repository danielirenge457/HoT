const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.*, up.* FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user profile
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, bio, location, nationality, date_of_birth, address, city, country, skills } = req.body;
    
    // Insert or update user
    const userResult = await pool.query(
      `INSERT INTO users (name, email, phone) 
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3
       RETURNING id`,
      [name, email, phone]
    );
    
    const userId = userResult.rows[0].id;
    
    // Insert or update profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, bio, location, nationality, date_of_birth, address, city, country, skills)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO UPDATE SET bio = $2, location = $3, nationality = $4, date_of_birth = $5, address = $6, city = $7, country = $8, skills = $9`,
      [userId, bio, location, nationality, date_of_birth, address, city, country, skills]
    );
    
    res.json({ success: true, user_id: userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

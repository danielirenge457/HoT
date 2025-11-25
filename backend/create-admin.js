const pool = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.error('Usage: set ADMIN_EMAIL and ADMIN_PASSWORD env vars or pass them as args');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) \
       VALUES ($1, $2, $3, 'admin') \
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role='admin' RETURNING *`,
      [name, email, hash]
    );

    console.log('Admin user created/updated:', result.rows[0].email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();

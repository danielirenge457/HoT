const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { initializeDatabase } = require('./schema');
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/jobs', jobPostingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'hope_of_tomorrow'}`);
});

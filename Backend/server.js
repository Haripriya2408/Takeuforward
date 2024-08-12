require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure PostgreSQL client
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Fetch all banners
app.get('/banners', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM banner');
    const now = new Date().getTime();

    // Calculate remaining time for each banner
    const updatedResults = rows.map(banner => {
      const endTime = new Date(banner.endtime).getTime(); // Make sure field names match your PostgreSQL schema
      banner.remainingTime = endTime > now ? endTime - now : 0;
      return banner;
    });

    res.json(updatedResults);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Insert a new banner
app.post('/banners', async (req, res) => {
  const { description, timer, link, is_visible } = req.body;

  // Ensure timer is an integer
  const parsedTimer = parseInt(timer, 10);

  if (isNaN(parsedTimer) || parsedTimer <= 0) {
    return res.status(400).json({ error: 'Invalid timer value' });
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + parsedTimer * 1000); // Calculate end time

  const sql = 'INSERT INTO banner (description, timer, link, is_visible, starttime, endtime) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
  try {
    const { rows } = await pool.query(sql, [description, parsedTimer, link, is_visible, startTime, endTime]);
    res.send({ id: rows[0].id });
  } catch (err) {
    console.error('Error inserting banner:', err);
    res.status(500).json({ error: 'Failed to insert banner' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

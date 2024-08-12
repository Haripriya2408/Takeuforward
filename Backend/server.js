require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Fetch all banners
app.get('/banners', (req, res) => {
  db.query('SELECT * FROM banner', (err, results) => {
    if (err) {
      console.error('Error fetching banners:', err);
      return res.status(500).json({ error: 'Failed to fetch banners' });
    }
    
    const now = new Date().getTime();

    // Calculate remaining time for each banner
    const updatedResults = results.map(banner => {
      const endTime = new Date(banner.endTime).getTime();
      banner.remainingTime = endTime > now ? endTime - now : 0;
      return banner;
    });

    res.json(updatedResults);
  });
});

// Insert a new banner
app.post('/banners', (req, res) => {
  const { description, timer, link, is_visible } = req.body;
  
  // Ensure timer is an integer
  const parsedTimer = parseInt(timer, 10);

  if (isNaN(parsedTimer) || parsedTimer <= 0) {
    return res.status(400).json({ error: 'Invalid timer value' });
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + parsedTimer * 1000); // Calculate end time

  const sql = 'INSERT INTO banner (description, timer, link, is_visible, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [description, parsedTimer, link, is_visible, startTime, endTime], (err, result) => {
    if (err) {
      console.error('Error inserting banner:', err);
      return res.status(500).json({ error: 'Failed to insert banner' });
    }
    res.send({ id: result.insertId });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Empty password for local MySQL
  database: 'sela_kota'
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Sela Kota API is running!' });
});

// Get all stories
app.get('/api/stories', (req, res) => {
  const query = 'SELECT * FROM stories ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Create new story
app.post('/api/stories', (req, res) => {
  console.log('POST request received:', req.body);
  const { title, content, category, latitude, longitude } = req.body;
  
  const query = 'INSERT INTO stories (title, content, category, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [title, content, category, latitude, longitude], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ 
        id: result.insertId, 
        message: 'Story created successfully!' 
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
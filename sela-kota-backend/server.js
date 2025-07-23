const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:5174', 
    'http://localhost:3001',
    'https://sela-kota.vercel.app',           // Add your Vercel domain
    'https://sela-kota-jmtgvyjx-ella-muslichs-projects.vercel.app' // Add your preview domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost/sela_kota',
  ssl: { rejectUnauthorized: false }
});

// Test database connection
db.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to PostgreSQL database!');
    release();
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Sela Kota API is running!' });
});

// Get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new story
app.post('/api/stories', async (req, res) => {
  const { title, content, category, latitude, longitude } = req.body;
  
  try {
    const result = await db.query(
      'INSERT INTO stories (title, content, category, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, content, category, latitude, longitude]
    );
    
    res.json({ 
      id: result.rows[0].id, 
      message: 'Story created successfully!' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
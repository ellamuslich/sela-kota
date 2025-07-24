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
    const result = await db.query('SELECT *, media_urls FROM stories ORDER BY created_at DESC');
    
    // Map media_urls back to mediaFiles format with better handling
    const stories = result.rows.map(story => {
      let mediaFiles = [];
      
      // Handle different formats of media_urls from PostgreSQL
      if (story.media_urls) {
        if (Array.isArray(story.media_urls)) {
          // Already an array
          mediaFiles = story.media_urls.map(url => ({
            type: (url && url.includes('video')) ? 'video' : 'image',
            url: url,
            name: 'uploaded_file'
          }));
        } else if (typeof story.media_urls === 'string') {
          // PostgreSQL might return as string, try to parse
          try {
            const parsed = JSON.parse(story.media_urls);
            if (Array.isArray(parsed)) {
              mediaFiles = parsed.map(url => ({
                type: (url && url.includes('video')) ? 'video' : 'image',
                url: url,
                name: 'uploaded_file'
              }));
            }
          } catch (e) {
            // If parsing fails, treat as empty array
            mediaFiles = [];
          }
        }
      }
      
      return {
        ...story,
        mediaFiles: mediaFiles
      };
    });
    
    res.json(stories);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new story
app.post('/api/stories', async (req, res) => {
  const { title, content, category, latitude, longitude, mediaFiles } = req.body;
  
  // Extract URLs from mediaFiles
  const mediaUrls = mediaFiles ? mediaFiles.map(file => file.url) : [];
  
  try {
    const result = await db.query(
      'INSERT INTO stories (title, content, category, latitude, longitude, media_urls) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [title, content, category, latitude, longitude, mediaUrls]
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
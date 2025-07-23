const mysql = require('mysql2/promise');

// Database connection
async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sela_kota'
  });
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getConnection();

    if (req.method === 'GET') {
      // Get all stories
      const [results] = await db.execute('SELECT * FROM stories ORDER BY created_at DESC');
      await db.end();
      res.json(results);
    } 
    else if (req.method === 'POST') {
      // Create new story
      const { title, content, category, latitude, longitude } = req.body;
      
      const [result] = await db.execute(
        'INSERT INTO stories (title, content, category, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
        [title, content, category, latitude, longitude]
      );
      
      await db.end();
      res.json({ 
        id: result.insertId, 
        message: 'Story created successfully!' 
      });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
};
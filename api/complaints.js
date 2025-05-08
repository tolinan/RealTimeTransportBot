const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  } else if (req.method === 'POST') {
    const { complaint_text, plateno, image_url } = req.body;
    try {
      await pool.query(
        'INSERT INTO complaints (complaint_text, plateno, image_url, created_at) VALUES ($1, $2, $3, NOW())',
        [complaint_text, plateno, image_url || null]
      );
      res.status(201).json({ message: 'Complaint submitted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit complaint' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
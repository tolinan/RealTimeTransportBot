const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const [vehicleCount, routeCount, complaintCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM vehicles'),
      pool.query('SELECT COUNT(*) FROM routes'),
      pool.query('SELECT COUNT(*) FROM complaints')
    ]);

    const widgets = [
      { label: 'Vehicles', count: vehicleCount.rows[0].count, icon: '🚗' },
      { label: 'Routes', count: routeCount.rows[0].count, icon: '🗺️' },
      { label: 'Complaints', count: complaintCount.rows[0].count, icon: '⚠️' }
    ];

    res.status(200).json({ widgets });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
}
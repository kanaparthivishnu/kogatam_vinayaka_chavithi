const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize database
const db = new sqlite3.Database('donations.db');
db.run(`CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`);

// Get all donations (public)
app.get('/api/donations', (req, res) => {
  db.all("SELECT name, amount FROM donations ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add donation (admin, password protected)
const ADMIN_PASSWORD = "kogatam2025";
app.post('/api/donations', (req, res) => {
  const { name, amount, password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'పాస్‌వర్డ్ తప్పు' });
  }
  if (!name || !amount || amount <= 0) {
    return res.status(400).json({ error: 'పూర్తి వివరాలు ఇవ్వండి' });
  }
  db.run("INSERT INTO donations (name, amount) VALUES (?, ?)", [name, amount], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
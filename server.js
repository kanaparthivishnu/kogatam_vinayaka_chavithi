const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Initialize database
const db = new Database("donations.db");
db.prepare(
  `CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`
).run();

// Get all donations (public)
app.get("/api/donations", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT name, amount, created_at as timestamp FROM donations ORDER BY created_at DESC"
      )
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add donation (admin, password protected)
const ADMIN_PASSWORD = "kogatam2025";
app.post("/api/donations", (req, res) => {
  const { name, amount, password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "పాస్‌వర్డ్ తప్పు" });
  }
  if (!name || !amount || amount <= 0) {
    return res.status(400).json({ error: "పూర్తి వివరాలు ఇవ్వండి" });
  }

  try {
    db.prepare("INSERT INTO donations (name, amount) VALUES (?, ?)").run(
      name,
      amount
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

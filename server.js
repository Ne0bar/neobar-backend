const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
const SECRET = "MD4TxajvkA22PCwMWqULrYTGKea63lVKrQc9QVuR9jA=";

const db = new sqlite3.Database("./neobar.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      recipient TEXT,
      preview TEXT,
      expires INTEGER
    )
  `);
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("No token");

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
}

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    err => {
      if (err) return res.status(400).send("User exists");
      res.send("User created");
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, user) => {
      if (!user) return res.status(401).send("Invalid");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).send("Invalid");

      const token = jwt.sign({ id: user.id }, SECRET);
      res.json({ token });
    }
  );
});

app.get("/messages", auth, (req, res) => {
  db.all(
    "SELECT * FROM messages WHERE user_id=? AND expires>?",
    [req.user.id, Date.now()],
    (err, rows) => res.json(rows || [])
  );
});

app.post("/messages", auth, (req, res) => {
  const { id, recipient, preview, expires } = req.body;

  db.run(
    "INSERT INTO messages VALUES (?, ?, ?, ?, ?)",
    [id, req.user.id, recipient, preview, expires],
    () => res.send("OK")
  );
});

app.listen(PORT, () => {
  console.log("🔥 API RUNNING → http://localhost:3000");
});

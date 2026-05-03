// ===== NEOBAR SaaS Backend (STABLE - NO DB) =====

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;
const SECRET = "MD4TxajvkA22PCwMWqULrYTGKea63lVKrQc9QVuR9jA=";

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("NEOBAR BACKEND LIVE");
});

// ===== REGISTER (TEMP - NO DB) =====
app.post("/register", async (req, res) => {
  const { username } = req.body;

  console.log("REGISTER:", username);

  res.send("User registered (temp)");
});

// ===== LOGIN (TEMP - RETURNS TOKEN) =====
app.post("/login", async (req, res) => {
  const { username } = req.body;

  console.log("LOGIN:", username);

  const token = jwt.sign({ user: username }, SECRET);

  res.json({ token });
});

// ===== AUTH MIDDLEWARE =====
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

// ===== TEST PROTECTED ROUTE =====
app.get("/protected", auth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log("🔥 NEOBAR API RUNNING → " + PORT);
});

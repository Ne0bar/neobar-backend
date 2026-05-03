const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NEOBAR BACKEND LIVE");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("LOGIN:", username);

  if (username === "admin" && password === "neobar") {
    return res.json({ token: "test-token-neobar" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/register", (req, res) => {
  res.json({ message: "Register endpoint working" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 API RUNNING ON PORT", PORT);
});

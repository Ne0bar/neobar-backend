const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("NEOBAR BACKEND LIVE");
});

// fake login route (just to test)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if(username === "admin" && password === "neobar"){
    return res.json({ token: "test-token" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 API RUNNING ON PORT", PORT);
});

// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Load User model
const User = require("./models/user");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===========================
// ✅ Register
// ===========================
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, age });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ===========================
// ✅ Login
// ===========================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login Attempt:", email, password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧾 Stored Hash:", user.password);
    console.log("🧪 Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});


// ===========================
// ✅ Start Server
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



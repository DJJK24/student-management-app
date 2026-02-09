const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require('dns');
require("dotenv").config();

const app = express();

// ⭐ IMPROVED CORS CONFIGURATION
app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// DNS fix
dns.setServers(['8.8.8.8', '1.1.1.1']);



// ... rest of your code
// Connect to MongoDB
mongoose.connect("mongodb+srv://acetianscrew_db_user:NP9tq9SLxSLOzhWS@cluster0.soktwfv.mongodb.net/studentDB")
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ Connection error:", err.message));

// Routes
const cors = require("cors");

// Update CORS to allow Netlify
app.use(cors({
  origin: [
    'https://fantastic-pithivier-277f32.netlify.app',
    'http://localhost:3000',
    'https://student-management-app-1-mfw3.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API",
    status: "Connected to MongoDB Atlas",
    endpoints: {
      students: "/students",
      health: "http://localhost:5000"
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
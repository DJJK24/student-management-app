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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected!");
    console.log("✅ Database:", mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error("❌ Connection error:", err.message);
  });

// Routes
app.use("/students", require("./routes/studentRoutes"));

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
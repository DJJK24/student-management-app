const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ['https://fantastic-pithivier-277f32.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection - SIMPLIFIED for Mongoose 6+
// Try WITHOUT +srv
const MONGO_URI = process.env.MONGO_URI || "mongodb://acetianscrew_db_user:NP9tq9SLxSLOzhWS@cluster0.soktwfv.mongodb.net/studentDB?retryWrites=true&w=majority";
console.log("Attempting to connect to MongoDB...");
console.log("Database:", MONGO_URI.split('@')[1]?.split('/')[1]?.split('?')[0]);

mongoose.connect(MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected successfully!");
  console.log("✅ Database ready!");
})
.catch(err => {
  console.error("❌ MongoDB connection FAILED:");
  console.error("Error:", err.message);
  console.error("Error name:", err.name);
  console.error("Error code:", err.code);
  
  console.log("⚠️ Running in degraded mode (no database)");
});

// Routes
app.use("/students", require("./routes/studentRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API",
    status: "running"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
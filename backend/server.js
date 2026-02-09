const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// FIXED CORS - Allow all origins for now
app.use(cors({
  origin: '*',  // Allow ALL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://acetianscrew_db_user:NP9tq9SLxSLOzhWS@cluster0.soktwfv.mongodb.net/studentDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ Connection error:", err.message));

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
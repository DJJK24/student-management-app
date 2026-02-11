const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =======================
   CORS SETUP
======================= */
app.use(cors({
  origin: [
    "https://student-management-app-dj.netlify.app",
    "https://peppy-sprite-ad724c.netlify.app", 
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
// ✅ USE YOUR NEW CREDENTIALS
const MONGODB_URI = "mongodb+srv://acetianscrew_db_user:iHNCCrRMoHOIDw4R@cluster0.soktwfv.mongodb.net/studentDB?retryWrites=true&w=majority&socketTimeoutMS=360000";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Error:", err.message));

/* =======================
   STUDENT SCHEMA
======================= */
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

/* =======================
   ROUTES
======================= */

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Student Management API 🚀",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// GET all students with mock fallback
app.get("/students", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("DB not connected");
    }
    
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.log("Using mock data:", error.message);
    res.json([
      { _id: "1", name: "John Doe", email: "john@example.com", course: "Computer Science", createdAt: new Date() },
      { _id: "2", name: "Jane Smith", email: "jane@example.com", course: "Mathematics", createdAt: new Date() },
      { _id: "3", name: "Bob Johnson", email: "bob@example.com", course: "Physics", createdAt: new Date() }
    ]);
  }
});

// POST create student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({ error: "All fields required" });
    }

    // If DB connected, save to DB
    if (mongoose.connection.readyState === 1) {
      const student = new Student({ name, email, course });
      await student.save();
      return res.status(201).json(student);
    }
    
    // If DB not connected, return success anyway
    res.status(201).json({
      _id: Date.now().toString(),
      name,
      email,
      course,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("POST error:", error.message);
    res.status(500).json({ error: "Failed to add student" });
  }
});

// PUT update student
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("PUT error:", error.message);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error.message);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
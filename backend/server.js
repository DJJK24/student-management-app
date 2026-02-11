const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =======================
   ✅ CORRECT CORS SETUP
======================= */
app.use(cors({
  origin: [
    "https://peppy-sprite-ad724c.netlify.app",      // CURRENT frontend
    "https://student-management-app-dj.netlify.app", // OLD frontend
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// Additional headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://djjaya24:password123@cluster0.soktwfv.mongodb.net/studentDB?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

/* =======================
   STUDENT SCHEMA & MODEL
======================= */
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

/* =======================
   ROUTES
======================= */

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Student Management API 🚀",
    status: "running",
    endpoints: {
      getAll: "GET /students",
      create: "POST /students",
      update: "PUT /students/:id",
      delete: "DELETE /students/:id"
    }
  });
});

// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("GET /students error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST create student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({ error: "All fields required" });
    }

    const student = new Student({ name, email, course });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.error("POST /students error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// PUT update student
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("PUT /students error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ 
      message: "Student deleted successfully",
      deletedStudent: student 
    });
  } catch (error) {
    console.error("DELETE /students error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
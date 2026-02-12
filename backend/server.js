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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* =======================
   MONGODB CONNECTION - UPDATED
======================= */
const API_BASE_URL = 'https://student-management-app-1-mfw3.onrender.com';
const API_URL = `${API_BASE_URL}/students`;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Error:", err.message));


// Connection state helpers
const isDbConnected = () => mongoose.connection.readyState === 1;

/* =======================
   STUDENT SCHEMA & MODEL
======================= */
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);

/* =======================
   MOCK DATA STORE (in-memory for fallback)
======================= */
let mockStudents = [
  { _id: "1", name: "John Doe", email: "john@example.com", course: "Computer Science", createdAt: new Date() },
  { _id: "2", name: "Jane Smith", email: "jane@example.com", course: "Mathematics", createdAt: new Date() },
  { _id: "3", name: "Bob Johnson", email: "bob@example.com", course: "Physics", createdAt: new Date() }
];

/* =======================
   ROUTES WITH FULL FALLBACK
======================= */

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Student Management API 🚀",
    database: isDbConnected() ? "connected" : "disconnected",
    usingMockData: !isDbConnected()
  });
});

// GET all students
app.get("/students", async (req, res) => {
  try {
    if (isDbConnected()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json(students);
    } else {
      console.log("⚠️ DB disconnected - returning mock data");
      return res.json(mockStudents);
    }
  } catch (error) {
    console.error("GET error:", error.message);
    res.json(mockStudents); // Fallback to mock on any error
  }
});

// POST create student
app.post("/students", async (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    if (isDbConnected()) {
      const student = new Student({ name, email, course });
      await student.save();
      return res.status(201).json(student);
    } else {
      // Create mock student
      const newStudent = {
        _id: Date.now().toString(),
        name,
        email,
        course,
        createdAt: new Date()
      };
      mockStudents.push(newStudent);
      console.log("✅ Mock student added:", newStudent);
      return res.status(201).json(newStudent);
    }
  } catch (error) {
    console.error("POST error:", error.message);
    // Even if DB fails, return success with mock
    const newStudent = {
      _id: Date.now().toString(),
      name,
      email,
      course,
      createdAt: new Date()
    };
    mockStudents.push(newStudent);
    res.status(201).json(newStudent);
  }
});

// PUT update student
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;

  try {
    if (isDbConnected()) {
      const student = await Student.findByIdAndUpdate(
        id,
        { name, email, course, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      return res.json(student);
    } else {
      // Update in mock data
      const index = mockStudents.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
      }
      mockStudents[index] = {
        ...mockStudents[index],
        name: name || mockStudents[index].name,
        email: email || mockStudents[index].email,
        course: course || mockStudents[index].course
      };
      console.log("✅ Mock student updated:", mockStudents[index]);
      return res.json(mockStudents[index]);
    }
  } catch (error) {
    console.error("PUT error:", error.message);
    // Try mock fallback
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Student not found" });
    }
    mockStudents[index] = {
      ...mockStudents[index],
      name: name || mockStudents[index].name,
      email: email || mockStudents[index].email,
      course: course || mockStudents[index].course
    };
    res.json(mockStudents[index]);
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const student = await Student.findByIdAndDelete(id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      return res.json({ message: "Student deleted successfully" });
    } else {
      // Delete from mock data
      const index = mockStudents.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
      }
      const deleted = mockStudents.splice(index, 1)[0];
      console.log("✅ Mock student deleted:", deleted);
      return res.json({ message: "Student deleted successfully", deletedStudent: deleted });
    }
  } catch (error) {
    console.error("DELETE error:", error.message);
    // Try mock fallback
    const index = mockStudents.findIndex(s => s._id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Student not found" });
    }
    mockStudents.splice(index, 1);
    res.json({ message: "Student deleted successfully" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: isDbConnected() ? "connected" : "disconnected",
    mockDataCount: mockStudents.length,
    timestamp: new Date().toISOString()
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 MongoDB: ${isDbConnected() ? "Connected" : "Disconnected - using mock data"}`);
});
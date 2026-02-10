const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ========== SIMPLE CORS FIX THAT WORKS ==========
// 1. Use cors middleware FIRST
app.use(cors({
  origin: '*',  // Allow ALL during debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 2. Handle preflight requests globally
app.options('*', cors());

// 3. Manually set CORS headers for EVERY request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin}`);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return res.status(200).json({});
  }
  
  next();
});
// ========== END CORS FIX ==========

app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://djjaya24:password123@cluster0.soktwfv.mongodb.net/studentDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// ========== ROUTES ==========

// GET all students
app.get('/students', async (req, res) => {
  console.log('GET /students request');
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    console.log(`Returning ${students.length} students`);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new student
app.post('/students', async (req, res) => {
  console.log('POST /students request:', req.body);
  try {
    const { name, email, course } = req.body;
    
    if (!name || !email || !course) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const student = new Student({
      name,
      email,
      course
    });
    
    await student.save();
    console.log('Student created:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update student
app.put('/students/:id', async (req, res) => {
  console.log(`PUT /students/${req.params.id}:`, req.body);
  try {
    const { id } = req.params;
    const { name, email, course } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, course, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE student
app.delete('/students/:id', async (req, res) => {
  console.log(`DELETE /students/${req.params.id}`);
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
});

// Root route - show CORS headers
app.get('/', (req, res) => {
  console.log('GET / request from:', req.headers.origin);
  res.json({ 
    message: 'Student Management API - CORS FIXED',
    corsHeaders: {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    endpoints: [
      { method: 'GET', path: '/students', desc: 'Get all students' },
      { method: 'POST', path: '/students', desc: 'Create student' },
      { method: 'PUT', path: '/students/:id', desc: 'Update student' },
      { method: 'DELETE', path: '/students/:id', desc: 'Delete student' }
    ]
  });
});

// Test endpoint to check CORS headers
app.get('/test-cors', (req, res) => {
  console.log('GET /test-cors from:', req.headers.origin);
  res.json({
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    headers: req.headers,
    corsFixed: true
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for all origins`);
  console.log(`📊 MongoDB URI: ${MONGODB_URI ? 'Set' : 'Not set'}`);
});
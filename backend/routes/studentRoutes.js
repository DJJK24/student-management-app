const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// IMPORTANT: Try-catch for model import
let Student;
try {
  Student = require('../models/Student');
  console.log('✅ Student model loaded successfully');
} catch (error) {
  console.error('❌ FAILED to load Student model:', error);
  Student = null;
}

// GET all students
router.get('/', async (req, res) => {
  console.log('🔍 GET /students endpoint called');
  
  // Check if model loaded
  if (!Student) {
    console.error('Student model is null!');
    return res.status(500).json({ 
      error: 'Student model not loaded',
      details: 'Check models/Student.js' 
    });
  }
  
  // Check database connection
  const dbState = mongoose.connection.readyState;
  console.log('Database connection state:', dbState);
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  
  if (dbState !== 1) {
    console.error('Database not connected! State:', dbState);
    return res.status(500).json({ 
      error: 'Database not connected',
      state: dbState 
    });
  }
  
  try {
    console.log('Attempting to fetch students from database...');
    
    // Try without .sort() first
    const students = await Student.find({});
    
    console.log(`✅ Success! Found ${students.length} students`);
    res.json(students || []);
    
  } catch (error) {
    console.error('❌ ERROR in Student.find():', error.message);
    console.error('Full error:', error);
    
    // Check if it's a collection issue
    if (error.message.includes('collection') || error.message.includes('not found')) {
      console.log('⚠️ Collection might not exist yet. This is normal for empty DB.');
      return res.json([]); // Return empty array
    }
    
    res.status(500).json({ 
      error: 'Database query failed',
      details: error.message,
      code: error.code
    });
  }
});

// POST create student (keep your existing code)
router.post('/', async (req, res) => {
  console.log('Received POST data:', req.body);

  if (!req.body.name || !req.body.email || !req.body.course) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'course']
    });
  }

  try {
    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      course: req.body.course
    });
    
    const savedStudent = await student.save();
    console.log('Student saved:', savedStudent);
    res.status(201).json(savedStudent);

  } catch (error) {
    console.error('POST error:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Email already exists',
        field: 'email'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }

    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
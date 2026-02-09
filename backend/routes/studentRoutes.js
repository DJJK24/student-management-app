const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create student
router.post('/', async (req, res) => {
  console.log('Received POST data:', req.body);

  // Validate required fields
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

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Email already exists',
        field: 'email'
      });
    }

    // Handle validation errors
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
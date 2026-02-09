// frontend/src/components/StudentForm.js
import React, { useState } from 'react';
import { addStudent } from '../services/api';
import './StudentForm.css';

function StudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newStudent = await addStudent(formData);
      console.log('Student added:', newStudent);
      alert('✅ Student added successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', course: '' });
      
      // Notify parent component (if needed)
      if (onStudentAdded) {
        onStudentAdded(newStudent);
      }
      
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(`❌ Error: ${error.response?.data?.error || 'Failed to add student'}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-wrapper">
      <div className="card">
        <div className="card-header">
          <h2>➕ Add New Student</h2>
          <p className="card-subtitle">Fill in the student details below</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">👤</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">📧</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">📚</div>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Course Name"
              required
              className="form-input"
            />
          </div>
          
          <button type="submit" className="submit-button">
            <span className="button-icon">➕</span>
            Add Student
          </button>
        </form>
        
        <div className="card-footer">
          <small>Student records will be saved in MongoDB</small>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;
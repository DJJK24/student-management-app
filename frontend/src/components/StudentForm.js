// src/components/StudentForm.js
import React, { useState } from 'react';
import { addStudent } from '../api'; // CHANGED: from '../services/api' to '../api'
import './StudentForm.css';

function StudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newStudent = await addStudent(formData);
      console.log('Student added:', newStudent);
      alert('✅ Student added successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', course: '' });
      
      // Notify parent component
      if (onStudentAdded) {
        onStudentAdded(newStudent);
      }
      
    } catch (error) {
      console.error('Error adding student:', error);
      alert(`❌ Error: ${error.response?.data?.error || error.message || 'Failed to add student'}`);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            <span className="button-icon">
              {loading ? '⏳' : '➕'}
            </span>
            {loading ? 'Adding Student...' : 'Add Student'}
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
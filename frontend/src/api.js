// src/api.js
import axios from 'axios';

const API_URL = 'https://student-management-app-1-mfw3.onrender.com/students';

export const fetchStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async (student) => {
  try {
    const response = await axios.post(API_URL, student);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const updateStudent = async (id, student) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, student);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
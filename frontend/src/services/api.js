import axios from 'axios';

// ✅ USE RENDER URL
const API_URL = "https://student-management-app-1-mfw3.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds for slow Render free tier
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStudents = () => api.get('/students');
export const createStudent = (student) => api.post('/students', student);
export const updateStudent = (id, student) => api.put(`/students/${id}`, student);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export default api;
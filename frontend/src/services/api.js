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

// ✅ CORRECTED getStudents - returns data array, not response object
export const getStudents = async () => {
  try {
    const response = await api.get('/students');
    console.log("API Response data:", response.data); // Debug
    return response.data; // Returns the array directly
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Other functions can stay as-is
export const createStudent = (student) => api.post('/students', student);
export const updateStudent = (id, student) => api.put(`/students/${id}`, student);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export default api;
// import axios from 'axios';

// const API_URL = 'https://student-management-app-1-mfw3.onrender.com/students';

// export const fetchStudents = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     throw error;
//   }
// };

// export const addStudent = async (student) => {
//   try {
//     const response = await axios.post(API_URL, student);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding student:', error);
//     throw error;
//   }
// };

// export const updateStudent = async (id, student) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, student);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating student:', error);
//     throw error;
//   }
// };

// export const deleteStudent = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting student:', error);
//     throw error;
//   }
// };


// frontend/src/api.js - USE THIS IMMEDIATELY
import axios from 'axios';

// ORIGINAL URL (what we want to connect to)
const BACKEND_URL = 'https://student-management-app-1-mfw3.onrender.com/students';

// CORS PROXY URL (will fix CORS issues)
const PROXY_URL = 'https://cors-anywhere.herokuapp.com';

// Combined URL with proxy
const API_URL = `${PROXY_URL}/${BACKEND_URL}`;

// Alternative proxy if heroku doesn't work
// const API_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(BACKEND_URL)}`;

export const fetchStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    // If using allorigins, data is in response.data.contents
    return response.data.contents ? JSON.parse(response.data.contents) : response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    // Fallback: Try direct connection
    try {
      const directResponse = await axios.get(BACKEND_URL);
      return directResponse.data;
    } catch (directError) {
      throw error;
    }
  }
};

export const addStudent = async (student) => {
  try {
    const response = await axios.post(API_URL, student);
    return response.data.contents ? JSON.parse(response.data.contents) : response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const updateStudent = async (id, student) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, student);
    return response.data.contents ? JSON.parse(response.data.contents) : response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data.contents ? JSON.parse(response.data.contents) : response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
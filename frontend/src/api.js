import axios from "axios";

const API = axios.create({
  baseURL: "https://student-management-app-1-mfw3.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET all students
export const fetchStudents = async () => {
  const response = await API.get("/students");
  return response.data;
};

// ADD student
export const addStudent = async (student) => {
  const response = await API.post("/students", student);
  return response.data;
};

// UPDATE student
export const updateStudent = async (id, student) => {
  const response = await API.put(`/students/${id}`, student);
  return response.data;
};

// DELETE student
export const deleteStudent = async (id) => {
  const response = await API.delete(`/students/${id}`);
  return response.data;
};

export default API;

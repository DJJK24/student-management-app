import { useEffect, useState } from "react";
import { getStudents, deleteStudent, updateStudent } from "../services/api";
import "./StudentList.css";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    course: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  const startEdit = (student) => {
    setEditId(student._id);
    setEditData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await updateStudent(id, editData);
      setEditId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student");
    }
  };

  if (loading) {
    return (
      <div className="list-container">
        <h2>📋 Student List</h2>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="list-container">
        <h2>📋 Student List</h2>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Students Yet</h3>
          <p>Add your first student using the form!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>📋 Student List</h2>
        <div className="stats">
          <span className="stat-badge">{students.length} Students</span>
        </div>
      </div>

      <div className="students-grid">
        {students.map((student) => (
          <div className="student-card" key={student._id}>
            {editId === student._id ? (
              <div className="edit-mode">
                <div className="edit-header">
                  <h3>✏️ Edit Student</h3>
                </div>
                <div className="edit-form">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Student Name"
                    className="edit-input"
                  />
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="Email Address"
                    className="edit-input"
                  />
                  <input
                    name="course"
                    value={editData.course}
                    onChange={handleEditChange}
                    placeholder="Course Name"
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdit(student._id)}>
                      💾 Save
                    </button>
                    <button className="cancel-btn" onClick={() => setEditId(null)}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="student-header">
                  <div className="avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="student-email">{student.email}</p>
                  </div>
                </div>

                <div className="student-details">
                  <div className="course-badge">
                    📚 {student.course}
                  </div>
                  {student.createdAt && (
                    <div className="date-added">
                      <small>📅 {new Date(student.createdAt).toLocaleDateString()}</small>
                    </div>
                  )}
                </div>

                <div className="student-actions">
                  <button 
                    className="action-btn edit-action" 
                    onClick={() => startEdit(student)}
                    title="Edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="action-btn delete-action" 
                    onClick={() => handleDelete(student._id)}
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentList;
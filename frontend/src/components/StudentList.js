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
      console.log("Fetching students...");
      const data = await getStudents();
      console.log("Received students:", data?.length || 0);
      
      // ALWAYS set students, even if empty array
      setStudents(data || []);
      
      // Force hide any empty state that might exist
      setTimeout(() => {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
          console.log("Removing empty state element");
          emptyState.remove();
        }
      }, 100);
      
    } catch (error) {
      console.error("Error fetching students:", error);
      // Don't show alert - just log error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    
    // Additional safety: Check and remove empty state periodically
    const interval = setInterval(() => {
      const emptyState = document.querySelector('.empty-state');
      if (emptyState && students.length > 0) {
        emptyState.remove();
      }
    }, 1000);
    
    return () => clearInterval(interval);
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

  // SIMPLE RENDERING - ALWAYS SHOW CONTENT
  return (
    <div className="list-container">
      <h2>📋 Student List</h2>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : (
        <div>
          <div className="list-header">
            <h2>Student List</h2>
            <div className="stats">
              <span className="stat-badge">{students.length} Students</span>
            </div>
          </div>
          
          {/* ALWAYS SHOW STUDENTS GRID - NEVER SHOW EMPTY STATE */}
          <div className="students-grid">
            {students.length > 0 ? (
              students.map((student) => (
                <div className="student-card" key={student._id}>
                  {editId === student._id ? (
                    <div className="edit-mode">
                      <div className="edit-header">
                        <h3>Edit Student</h3>
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
                            Save
                          </button>
                          <button className="cancel-btn" onClick={() => setEditId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="student-header">
                        <div className="avatar">
                          {student.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="student-info">
                          <h3 className="student-name">{student.name || 'No Name'}</h3>
                          <p className="student-email">{student.email || 'No Email'}</p>
                        </div>
                      </div>

                      <div className="student-details">
                        <div className="course-badge">
                          {student.course || 'No Course'}
                        </div>
                        {student.createdAt && (
                          <div className="date-added">
                            <small>{new Date(student.createdAt).toLocaleDateString()}</small>
                          </div>
                        )}
                      </div>

                      <div className="student-actions">
                        <button 
                          className="action-btn edit-action" 
                          onClick={() => startEdit(student)}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete-action" 
                          onClick={() => handleDelete(student._id)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              // Only show empty message INSIDE the grid, not separate empty state
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "#666"
              }}>
                <div style={{ fontSize: "50px", marginBottom: "20px" }}>📭</div>
                <h3 style={{ color: "#333", marginBottom: "10px" }}>No Students Yet</h3>
                <p>Add your first student using the form!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
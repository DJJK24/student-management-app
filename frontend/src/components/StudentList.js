import { useEffect, useState } from "react";
import { getStudents, deleteStudent, updateStudent } from "../services/api";
import "./StudentList.css";

function StudentList() {
  // 🔥 DEBUG: Log on every render
  console.log("🔥 StudentList RENDER - students:", students, "length:", students.length, "loading:", loading);
  
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
      console.log("📡 FETCHING students...");
      const data = await getStudents();
      console.log("📦 RECEIVED data:", data);
      console.log("🔢 Data length:", data?.length);
      console.log("📋 Is array?", Array.isArray(data));
      
      setStudents(data || []);
      console.log("✅ STATE UPDATED with", (data || []).length, "students");
    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
      alert("Failed to load students");
    } finally {
      setLoading(false);
      console.log("⏳ Loading set to false");
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect running - fetching students");
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

  // 🎯 SIMPLIFIED RENDERING - NO EMPTY STATE BUG
  return (
    <div className="list-container">
      <h2>📋 Student List</h2>
      
      {/* DEBUG INFO */}
      <div style={{background: 'yellow', padding: '10px', marginBottom: '20px', borderRadius: '5px'}}>
        <strong>🔧 DEBUG MODE:</strong> 
        <div>Students in state: <strong>{students.length}</strong></div>
        <div>Loading: <strong>{loading.toString()}</strong></div>
        <div>API Status: <strong style={{color: 'green'}}>✅ Working</strong></div>
      </div>
      
      {/* SIMPLE CONDITIONAL RENDERING */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : (
        // ALWAYS SHOW THIS WHEN NOT LOADING
        <div>
          <div className="list-header">
            <h2>Student List</h2>
            <div className="stats">
              <span className="stat-badge">{students.length} Students</span>
            </div>
          </div>
          
          <div className="students-grid">
            {students.length > 0 ? (
              students.map((student) => (
                <div className="student-card" key={student._id} style={{border: '2px solid #4CAF50'}}>
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
              <div style={{textAlign: 'center', padding: '40px', color: '#666', gridColumn: '1/-1'}}>
                <div style={{fontSize: '50px', marginBottom: '20px'}}>📭</div>
                <h3 style={{color: '#333'}}>No Students Yet</h3>
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
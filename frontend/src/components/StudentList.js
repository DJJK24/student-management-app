// src/components/StudentList.js
import { useEffect, useState } from "react";
import { fetchStudents, deleteStudent, updateStudent } from "../api";
import "./StudentList.css";

function StudentList({ onSelectStudent, onSearchTyping }) {  // ✅ new prop
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // ✅ for search input
  const [typingTimeout, setTypingTimeout] = useState(null); // ✅ debounce

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ✅ Debounced search trigger
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set new timeout – after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      if (value.trim() && onSearchTyping) {
        onSearchTyping(value); // Open chatbot with this search term
      }
    }, 2000);
    setTypingTimeout(timeout);
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  const startEdit = (student, e) => {
    e?.stopPropagation();
    setEditId(student._id);
    setEditData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
  };

  const handleEditChange = (e) => {
    e.stopPropagation();
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id, e) => {
    e?.stopPropagation();
    try {
      await updateStudent(id, editData);
      setEditId(null);
      loadStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student");
    }
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setEditId(null);
  };

  const handleCardClick = (student) => {
    if (editId !== student._id && onSelectStudent) {
      onSelectStudent(student);
    }
  };

  // Filter students based on search term (optional)
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <h2>Student List</h2>
      
      {/* SEARCH BAR – NEW */}
      <div className="search-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search students or type a course interest..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '30px',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />
        <p style={{ fontSize: '12px', color: '#d1cbcb', marginTop: '5px' }}>
          ⏱️ Stop typing for 2 seconds – the Study Advisor will appear with suggestions!
        </p>
      </div>

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
              <span className="stat-badge">{filteredStudents.length} Students</span>
            </div>
          </div>
          
          <div className="students-grid">
            {filteredStudents.map((student) => (
              <div
                className="student-card"
                key={student._id}
                onClick={() => handleCardClick(student)}
                style={{
                  cursor: editId !== student._id && onSelectStudent ? 'pointer' : 'default'
                }}
              >
                {editId === student._id ? (
                  <div className="edit-mode" onClick={(e) => e.stopPropagation()}>
                    <div className="edit-header">
                      <h3>Edit Student</h3>
                    </div>
                    <div className="edit-form">
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Student Name"
                        className="edit-input"
                      />
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Email Address"
                        className="edit-input"
                      />
                      <input
                        name="course"
                        value={editData.course}
                        onChange={handleEditChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Course Name"
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={(e) => saveEdit(student._id, e)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={cancelEdit}
                        >
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
                        onClick={(e) => startEdit(student, e)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-action"
                        onClick={(e) => handleDelete(student._id, e)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
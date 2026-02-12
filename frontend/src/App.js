import { useState, useEffect } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [dark, setDark] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // Test backend connection on load
  useEffect(() => {
    const testConnection = async () => {
      try {
        // const response = await fetch('https://student-management-app-1-mfw3.onrender.com/students');
        // const data = await response.json();
        const data = await fetchStudents();


        setBackendStatus(`✅ Connected (${data.length} students)`);
      } catch (error) {
        setBackendStatus(`❌ Connection failed: ${error.message}`);
      }
    };
    testConnection();
  }, []);

  const handleStudentAdded = () => {
    setRefreshList(!refreshList); // Trigger refresh
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="app-header">
        <button className="toggle-btn" onClick={() => setDark(!dark)}>
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>
        
        <div className="header-content">
          <h1 className="title">🎓 Student Management System</h1>
          <p className="subtitle">Manage your student records efficiently</p>
          <div className="backend-status" style={{
            background: backendStatus.includes('✅') ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px',
            marginTop: '10px',
            display: 'inline-block'
          }}>
            {backendStatus}
          </div>
        </div>
      </header>

      <div className="content-container">
        <div className="form-column">
          <StudentForm onStudentAdded={handleStudentAdded} />
        </div>
        
        <div className="list-column">
          <StudentList key={refreshList} />
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Student Management System</p>
          <p className="tech-stack">SUCESS OF LIFE</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
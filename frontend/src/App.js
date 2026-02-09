import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [dark, setDark] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

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
          <p>© {new Date().getFullYear()} Student Management System, Inc.</p>
          <p className="tech-stack">Built with ❤️ using React, Node.js & MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
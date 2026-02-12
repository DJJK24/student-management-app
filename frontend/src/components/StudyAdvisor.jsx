import React, { useState, useEffect } from 'react';

const StudyAdvisor = ({ selectedStudent }) => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hi! I’m your Study Advisor. Click on any student to get personalised course recommendations!' }
  ]);
  const [input, setInput] = useState('');

  // When a student is selected, add a bot message about them
  useEffect(() => {
    if (selectedStudent) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `📌 Now advising: **${selectedStudent.name}** (${selectedStudent.course})` }
      ]);
    }
  }, [selectedStudent]);

  const getBotReply = (userMessage) => {
    const interest = userMessage.toLowerCase();

    // 🎯 PERSONALISED SUGGESTION – based on selected student's course
    if (selectedStudent) {
      const course = selectedStudent.course.toLowerCase();
      const name = selectedStudent.name.split(' ')[0]; // first name only

      if (course.includes('computer') || course.includes('cs') || course.includes('software')) {
        return `🎓 Since ${name} is studying ${selectedStudent.course}, I recommend **Data Structures & Algorithms** next, then **Full Stack Development**.`;
      }
      if (course.includes('math')) {
        return `📐 For ${name}, next step: **Applied Statistics & Machine Learning** with Python.`;
      }
      if (course.includes('physics')) {
        return `⚛️ ${name} might enjoy **Computational Physics** or **Quantum Computing** fundamentals.`;
      }
      if (course.includes('web') || course.includes('mern') || course.includes('react')) {
        return `🔥 ${name} is already on the right track! Next: **Advanced MERN – Authentication, WebSockets & Deployment**.`;
      }
      if (course.includes('data') || course.includes('science')) {
        return `📊 Great foundation! Next for ${name}: **Machine Learning Specialization** or **Big Data Analytics**.`;
      }
      if (course.includes('business') || course.includes('management')) {
        return `💼 Suggest **IT Project Management** or **Business Analytics** for ${name}.`;
      }
      // Default personalised message
      return `✨ For ${name}, I recommend exploring **Cloud Computing (AWS/Azure)** – it complements any domain.`;
    }

    // 🔍 KEYWORD-BASED FALLBACK (your existing smart rules)
    if (interest.includes('mern') || interest.includes('stack') || 
        (interest.includes('full') && interest.includes('stack')) ||
        interest.includes('react') || interest.includes('node') || 
        interest.includes('express') || interest.includes('mongodb') ||
        interest.includes('frontend') || interest.includes('backend')) {
      return '🔥 Since you like MERN, try **Advanced MERN: Authentication, WebSockets & Deployment**!';
    }
    if (interest.includes('web') || interest.includes('html') || interest.includes('css')) {
      return '🌐 Level up with **Responsive Design & CSS Frameworks**!';
    }
    if (interest.includes('python') || interest.includes('data') || 
        interest.includes('pandas') || interest.includes('numpy')) {
      return '🐍 You might love **Data Science with Python & Machine Learning**!';
    }
    if (interest.includes('java') || interest.includes('spring')) {
      return '☕ Check out **Spring Boot Microservices & Cloud**!';
    }
    if (interest.includes('database') || interest.includes('sql') || 
        interest.includes('mysql') || interest.includes('postgres')) {
      return '🗄️ Master **Advanced SQL & Database Design**!';
    }
    if (interest.includes('mongo') || interest.includes('nosql')) {
      return '🍃 Go deeper with **MongoDB Aggregation & Atlas**!';
    }
    return '✨ We have a great **Cloud Computing** fundamentals course!';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    // Get bot reply
    const botReply = getBotReply(input);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);

    setInput('');
  };

  const clearSelection = () => {
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: '👆 Selection cleared. Click on any student to advise them.' }
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {showChat ? (
        <div style={{
          width: '380px',
          maxWidth: '100%',
          height: '500px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#007bff',
            color: 'white',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>🎓 Study Advisor</span>
            <div>
              {selectedStudent && (
                <button
                  onClick={clearSelection}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    marginRight: '8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >✕</button>
            </div>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#f9f9f9'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' 
                    ? '18px 18px 4px 18px' 
                    : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? '#007bff' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} style={{
            display: 'flex',
            padding: '12px',
            borderTop: '1px solid #eee',
            background: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about courses or type a subject..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '24px',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: '8px',
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >Send</button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowChat(true)}
          style={{
            padding: '14px 28px',
            borderRadius: '40px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 6px 16px rgba(0,123,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          💬 Ask Study Advisor
          {selectedStudent && (
            <span style={{
              background: '#ffc107',
              color: '#333',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              marginLeft: '5px'
            }}>
              1 selected
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default StudyAdvisor;
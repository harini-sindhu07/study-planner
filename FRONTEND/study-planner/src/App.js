import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [subjects, setSubjects] = useState([{ name: '', hours: '' }]);
  const [dailyHours, setDailyHours] = useState(4);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', hours: '' }]);
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-plan', {
        subjects: subjects.filter(s => s.name),
        dailyHours: parseInt(dailyHours)
      });
      setPlan(response.data);
    } catch (error) {
      alert('Error! Make sure backend is running on port 5000');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🎓 AI Study Planner</h1>
      
      <div className="input-section">
        <label>Daily Study Hours:</label>
        <input 
          type="number" 
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
          min="1" max="12"
        />
      </div>

      <div className="subjects">
        {subjects.map((subject, index) => (
          <div key={index} className="subject-input">
            <input 
              placeholder="Subject name"
              value={subject.name}
              onChange={(e) => updateSubject(index, 'name', e.target.value)}
            />
            <input 
              placeholder="Total hours needed"
              type="number"
              value={subject.hours}
              onChange={(e) => updateSubject(index, 'hours', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addSubject}>+ Add Subject</button>
      </div>

      <button 
        onClick={generatePlan} 
        disabled={loading}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate Study Plan'}
      </button>

      {plan && (
        <div className="plan">
          <h2>Your 7-Day Study Plan:</h2>
          {Object.entries(plan).map(([day, tasks]) => (
            <div key={day} className="day">
              <h3>{day.replace('day', 'Day ')}</h3>
              <ul>
                {tasks.map((task, i) => (
                  <li key={i}>{task.subject} - {task.duration}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
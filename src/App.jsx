import { useState } from 'react';
import { calculateGPA } from './utils/calculateGPA';
import './App.css';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [credits, setCredits] = useState('');

  // Цю функцію ми будемо відстежувати в Лабі 5 (Аналітика)
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!name || !grade || !credits) return;

    const newSubject = {
      id: Date.now(),
      name,
      grade: parseFloat(grade),
      credits: parseFloat(credits)
    };

    setSubjects([...subjects, newSubject]);
    
    // Очищуємо форму після додавання
    setName('');
    setGrade('');
    setCredits('');
  };

  // І цю функцію теж будемо відстежувати
  const handleDelete = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const gpa = calculateGPA(subjects);

  return (
    <div className="container">
      <h1>GradeCalc 🎓</h1>

      <form onSubmit={handleAddSubject} className="add-form">
        <input
          type="text"
          placeholder="Назва предмета"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Оцінка (наприклад, 90)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <input
          type="number"
          placeholder="Кредити (наприклад, 3)"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
        />
        <button type="submit" className="add-btn">Додати</button>
      </form>

      <div className="result-section">
        <h2>Твій середній бал: {gpa}</h2>
      </div>

      <ul className="subject-list">
        {subjects.map(sub => (
          <li key={sub.id} className="subject-item">
            <span>{sub.name} (Оцінка: {sub.grade}, Кредити: {sub.credits})</span>
            <button onClick={() => handleDelete(sub.id)} className="delete-btn">Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
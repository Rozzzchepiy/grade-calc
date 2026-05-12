import { useState, useEffect } from 'react';
import './App.css';
import posthog from 'posthog-js';

function App() {
  // Зчитуємо змінну оточення (Крок 2)
  const appStatus = import.meta.env.VITE_APP_STATUS;

  // Ініціалізація профілів з LocalStorage
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('gradecalc_profiles');
    if (saved) return JSON.parse(saved);
    return [{ id: 'default', name: 'Мій профіль', subjects: [], extraPoints: 0 }];
  });

  // Стан для активного профілю
  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem('gradecalc_active_profile') || 'default';
  });

  // Локальні стани для форми
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [credits, setCredits] = useState('');

  // Збереження в LocalStorage при кожній зміні
  useEffect(() => {
    localStorage.setItem('gradecalc_profiles', JSON.stringify(profiles));
    localStorage.setItem('gradecalc_active_profile', activeProfileId);
  }, [profiles, activeProfileId]);

  // Отримуємо дані поточного профілю
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const subjects = activeProfile.subjects;

  // Рахуємо поточну суму кредитів
  const totalCredits = subjects.reduce((sum, sub) => sum + sub.credits, 0);

  // --- ЛОГІКА РОЗРАХУНКУ ---
  let ratingScore = 0;
  if (totalCredits > 0) {
    const totalPoints = subjects.reduce((sum, sub) => sum + (sub.grade * sub.credits), 0);
    ratingScore = totalPoints / totalCredits;
  }
  
  // Формула: 95% за навчання + 5% додаткових балів
  const scholarshipScore = (ratingScore * 0.95) + ((activeProfile.extraPoints || 0) * 0.05);

  // Функція для оновлення даних поточного профілю
  const updateActiveProfile = (updates) => {
    setProfiles(profiles.map(p => 
      p.id === activeProfileId ? { ...p, ...updates } : p
    ));
  };

  // --- ОБРОБНИКИ ПОДІЙ ---
  const handleAddSubject = (e) => {
    e.preventDefault();
    const g = parseFloat(grade);
    const c = parseFloat(credits);

    if (!name || isNaN(g) || isNaN(c)) return alert('Будь ласка, заповніть всі поля коректно.');
    if (g < 0 || g > 100) return alert('Оцінка за предмет не може бути більшою за 100 або меншою за 0.');
    if (c <= 0) return alert('Кількість кредитів має бути більшою за 0.');
    if (totalCredits + c > 30) return alert(`Перевищено ліміт кредитів за семестр! Ви можете додати максимум ще ${30 - totalCredits} кр.`);

    const newSubject = { id: Date.now().toString(), name, grade: g, credits: c };
    updateActiveProfile({ subjects: [...subjects, newSubject] });

    posthog.capture('subject_added', {
    subject_name: name,
    credits: c
    });

    setName(''); setGrade(''); setCredits('');
  };

  const handleDeleteSubject = (id) => {
    updateActiveProfile({ subjects: subjects.filter(sub => sub.id !== id) });
    posthog.capture('subject_deleted');
  };

  const handleAddProfile = () => {
    const profileName = prompt('Введіть ім\'я для нового розрахунку:');
    if (!profileName) return;
    const newProfile = { id: Date.now().toString(), name: profileName, subjects: [], extraPoints: 0 };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleDeleteProfile = () => {
    if (profiles.length === 1) return alert('Ви не можете видалити єдиний профіль.');
    if (window.confirm(`Видалити профіль "${activeProfile.name}"?`)) {
      const newProfiles = profiles.filter(p => p.id !== activeProfileId);
      setProfiles(newProfiles);
      setActiveProfileId(newProfiles[0].id);
    }
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>
          GradeCalc 🎓
          {/* Виведення змінної оточення в інтерфейс */}
          <span style={{ 
            fontSize: '12px', 
            background: '#e0e0e0', 
            color: '#333',
            padding: '4px 8px', 
            borderRadius: '6px', 
            marginLeft: '15px',
            verticalAlign: 'middle',
            fontWeight: 'normal'
          }}>
            {appStatus}
          </span>
        </h1>
        
        {/* Управління профілями */}
        <div className="profile-controls">
          <select 
            value={activeProfileId} 
            onChange={(e) => setActiveProfileId(e.target.value)}
            className="profile-select"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
            {/* Кнопка з'явиться ТІЛЬКИ якщо прапорець увімкнено в адмінці */}
            {posthog.isFeatureEnabled('show-new-profile-btn') && (
              <button onClick={handleAddProfile} className="btn secondary-btn">+ Новий</button>
            )}
          {profiles.length > 1 && (
            <button onClick={handleDeleteProfile} className="btn delete-profile-btn">🗑️</button>
          )}
        </div>
      </div>

      {/* Форма додавання предметів */}
      <form onSubmit={handleAddSubject} className="add-form">
        <input type="text" placeholder="Назва предмета" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Оцінка (макс 100)" value={grade} onChange={(e) => setGrade(e.target.value)} />
        <input type="number" placeholder="Кредити" value={credits} onChange={(e) => setCredits(e.target.value)} />
        <button type="submit" className="btn add-btn">Додати</button>
      </form>

      {/* Додаткові бали */}
      <div className="extra-points-section">
        <label>Додаткові бали (макс 100):</label>
        <input 
          type="number" 
          value={activeProfile.extraPoints} 
          onChange={(e) => {
            let val = parseFloat(e.target.value) || 0;
            if (val > 100) val = 100;
            if (val < 0) val = 0;
            updateActiveProfile({ extraPoints: val });
          }} 
          className="extra-input"
        />
      </div>

      {/* Результати */}
      <div className="result-section">
        <div className="result-card">
          <span>Рейтинговий бал:</span>
          <h2>{ratingScore.toFixed(2)}</h2>
        </div>
        <div className="result-card highlight">
          <span>Бал на стипендію:</span>
          <h2>{scholarshipScore.toFixed(2)}</h2>
        </div>
      </div>
      
      <div className="credits-counter">
        Використано кредитів: {totalCredits} / 30
      </div>

      {/* Список предметів */}
      <ul className="subject-list">
        {subjects.map(sub => (
          <li key={sub.id} className="subject-item">
            <div className="subject-info">
              <strong>{sub.name}</strong>
              <span>Оцінка: {sub.grade} | Кредити: {sub.credits}</span>
            </div>
            <button onClick={() => handleDeleteSubject(sub.id)} className="btn delete-btn">Видалити</button>
          </li>
        ))}
        {subjects.length === 0 && <p className="empty-text">Додайте свій перший предмет!</p>}
      </ul>
        <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <button 
          onClick={() => {
            throw new Error("Sentry Test Error: GradeCalc crashed!");
          }} 
          style={{ background: 'red', color: 'white', padding: '10px' }}
        >
          💥 Зламати додаток (Test Sentry)
        </button>
      </div>


    </div>
  );
}

export default App;
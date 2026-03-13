import { Link } from 'react-router-dom';
import { chords } from '../../data/chords';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import './Home.css';
import { useMemo } from 'react';

export default function Home() {
  const chordOfTheDay = useMemo(() => {
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % chords.length;
    return chords[dayIndex];
  }, []);

  const practiced = JSON.parse(localStorage.getItem('practiced') || '[]');

  const sections = [
    { to: '/chords', icon: '🎸', title: 'אקורדים', desc: 'למדו את כל האקורדים הבסיסיים עם דיאגרמות ברורות' },
    { to: '/theory', icon: '📖', title: 'תיאוריה', desc: 'הבינו מה עומד מאחורי כל סוג אקורד' },
    { to: '/strumming', icon: '🎵', title: 'פריטה', desc: 'תרגלו דפוסי פריטה עם אנימציות ומטרונום' },
    { to: '/songs', icon: '🎤', title: 'שירים', desc: 'נגנו יחד עם שירים — אקורדים, דפוס פריטה ומטרונום מסונכרנים' },
    { to: '/practice', icon: '⏱️', title: 'תרגול', desc: 'אימון עם טיימר, תרגילי מעבר ומטרונום' },
  ];

  return (
    <div className="page fade-in">
      <div className="home__hero">
        <h1 className="home__title">ברוכים הבאים למדריך הגיטרה! 🎸</h1>
        <p className="home__subtitle">כאן תלמדו אקורדים, תיאוריה, פריטה ותתרגלו — הכל במקום אחד</p>
      </div>

      <div className="home__cotd card">
        <div className="home__cotd-text">
          <h2>🌟 האקורד של היום</h2>
          <p className="home__cotd-name">{chordOfTheDay.name}</p>
          <p className="home__cotd-he">{chordOfTheDay.nameHe}</p>
        </div>
        <div className="home__cotd-diagram">
          <ChordDiagram chord={chordOfTheDay} size={1.4} />
        </div>
      </div>

      {practiced.length > 0 && (
        <div className="home__progress card">
          <h3>📊 ההתקדמות שלך</h3>
          <p>תרגלת <strong>{practiced.length}</strong> מתוך <strong>{chords.length}</strong> אקורדים</p>
          <div className="home__progress-bar">
            <div
              className="home__progress-fill"
              style={{ width: `${(practiced.length / chords.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="home__sections">
        {sections.map((section) => (
          <Link key={section.to} to={section.to} className="home__section card">
            <span className="home__section-icon">{section.icon}</span>
            <h3>{section.title}</h3>
            <p>{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

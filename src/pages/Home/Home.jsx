import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chords } from '../../data/chords';
import { songs } from '../../data/songs';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDailyGoal } from '../../hooks/useDailyGoal';
import './Home.css';

export default function Home() {
  const chordOfTheDay = useMemo(() => {
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % chords.length;
    return chords[dayIndex];
  }, []);

  const practiced = JSON.parse(localStorage.getItem('practiced') || '[]');

  const [userName, setUserName] = useLocalStorage('user-name', '');
  const [nameInput, setNameInput] = useState('');
  const [editingName, setEditingName] = useState(false);

  const [favorites] = useLocalStorage('favorites', []);
  const [lastPlayed] = useLocalStorage('last-played', null);
  const { seconds, goalSeconds } = useDailyGoal();

  const lastSong = lastPlayed ? songs.find((s) => s.id === lastPlayed.songId) : null;

  const favSongs = useMemo(
    () => songs.filter((s) => favorites.includes(s.id)),
    [favorites]
  );

  const goalPct = Math.min((seconds / goalSeconds) * 100, 100);
  const goalMinutes = Math.floor(seconds / 60);
  const goalRemaining = Math.max(0, Math.ceil((goalSeconds - seconds) / 60));

  const sections = [
    { to: '/tuner', icon: '🎯', title: 'כוונון', desc: 'כוונו את הגיטרה עם מיקרופון או צליל ייחוס' },
    { to: '/theory', icon: '📖', title: 'תיאוריה', desc: 'הבינו מה עומד מאחורי כל סוג אקורד' },
    { to: '/chords', icon: '🎸', title: 'אקורדים', desc: 'למדו את כל האקורדים הבסיסיים עם דיאגרמות ברורות' },
    { to: '/strumming', icon: '🎵', title: 'פריטה', desc: 'תרגלו דפוסי פריטה עם אנימציות ומטרונום' },
    { to: '/songs', icon: '🎤', title: 'שירים', desc: 'נגנו יחד עם שירים — אקורדים, דפוס פריטה ומטרונום מסונכרנים' },
    { to: '/practice', icon: '⏱️', title: 'תרגול', desc: 'אימון עם טיימר, תרגילי מעבר ומטרונום' },
  ];

  const handleNameSave = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
    }
    setEditingName(false);
    setNameInput('');
  };

  return (
    <div className="page fade-in">
      {/* Welcome / Name */}
      <div className="home__hero">
        {userName ? (
          <>
            <h1 className="home__title">
              שלום {userName}, מוכנה לנגן? 🎸
            </h1>
            <button
              type="button"
              className="home__name-edit-btn"
              onClick={() => { setEditingName(true); setNameInput(userName); }}
            >
              שנה שם
            </button>
          </>
        ) : (
          <h1 className="home__title">ברוכים הבאים למדריך הגיטרה! 🎸</h1>
        )}

        {(!userName || editingName) && (
          <div className="home__name-form">
            <input
              type="text"
              className="home__name-input"
              placeholder="מה השם שלך?"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); }}
              maxLength={30}
              autoFocus={editingName}
            />
            <button type="button" className="home__name-save" onClick={handleNameSave}>
              {editingName ? 'עדכון' : 'שמור'}
            </button>
            {editingName && (
              <button type="button" className="home__name-cancel" onClick={() => setEditingName(false)}>
                ביטול
              </button>
            )}
          </div>
        )}

        <p className="home__subtitle">כאן תלמדו אקורדים, תיאוריה, פריטה ותתרגלו — הכל במקום אחד</p>
      </div>

      {/* Personal strip: Daily Goal + Continue Playing */}
      <div className="home__personal-strip">
        {/* Daily Goal */}
        <div className="home__daily-goal card">
          <h3>🎯 יעד יומי — 20 דקות</h3>
          <div className="home__daily-goal-bar">
            <div className="home__daily-goal-fill" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="home__daily-goal-text">
            {goalPct >= 100
              ? '🎉 כל הכבוד! השלמת את היעד היומי!'
              : `תרגלת ${goalMinutes} דקות — נשארו ${goalRemaining} דקות`}
          </p>
        </div>

        {/* Continue Playing */}
        {lastSong && (
          <Link to="/songs" className="home__continue card">
            <span className="home__continue-icon">▶</span>
            <div className="home__continue-info">
              <h3>המשך לנגן</h3>
              <p>{lastSong.titleHe} — {lastSong.artist}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Favorites */}
      {favSongs.length > 0 && (
        <div className="home__favorites">
          <h3 className="home__favorites-title">❤️ המועדפים שלי</h3>
          <div className="home__favorites-list">
            {favSongs.map((song) => (
              <Link key={song.id} to="/songs" className="home__favorites-item card">
                <span className="home__favorites-item-title">{song.titleHe}</span>
                <span className="home__favorites-item-artist">{song.artist}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

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

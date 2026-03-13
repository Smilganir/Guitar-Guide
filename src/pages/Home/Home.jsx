import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chords } from '../../data/chords';
import { songs } from '../../data/songs';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import { useLocale } from '../../contexts/LocaleContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDailyGoal } from '../../hooks/useDailyGoal';
import './Home.css';

export default function Home() {
  const { t, locale } = useLocale();
  const chordOfTheDay = useMemo(() => {
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % chords.length;
    return chords[dayIndex];
  }, []);

  const practiced = JSON.parse(localStorage.getItem('practiced') || '[]');

  const [userName, setUserName] = useLocalStorage('user-name', '');
  const [userGender, setUserGender] = useLocalStorage('user-gender', ''); // 'm' | 'f'
  const [nameInput, setNameInput] = useState('');
  const [genderInput, setGenderInput] = useState('');
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
    { to: '/tuner', icon: '🎯', titleKey: 'tuner', descKey: 'tunerDesc' },
    { to: '/theory', icon: '📖', titleKey: 'theory', descKey: 'theoryDesc' },
    { to: '/chords', icon: '🎸', titleKey: 'chords', descKey: 'chordsDesc' },
    { to: '/strumming', icon: '🎵', titleKey: 'strumming', descKey: 'strummingDesc' },
    { to: '/songs', icon: '🎤', titleKey: 'songs', descKey: 'songsDesc' },
    { to: '/practice', icon: '⏱️', titleKey: 'practice', descKey: 'practiceDesc' },
  ];

  const handleNameSave = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      if (genderInput) setUserGender(genderInput);
    }
    setEditingName(false);
    setNameInput('');
    setGenderInput('');
  };

  const helloKey = userGender === 'm' ? 'home.helloM' : 'home.helloF';

  return (
    <div className="page fade-in">
      {/* Welcome / Name */}
      <div className="home__hero">
        {userName ? (
          <>
            <h1 className="home__title">
              {t(helloKey, { name: userName })}
            </h1>
            <button
              type="button"
              className="home__name-edit-btn"
              onClick={() => { setEditingName(true); setNameInput(userName); setGenderInput(userGender); }}
            >
              {t('home.changeName')}
            </button>
          </>
        ) : (
          <h1 className="home__title">{t('home.welcome')}</h1>
        )}

        {(!userName || editingName) && (
          <div className="home__name-form">
            <input
              type="text"
              className="home__name-input"
              placeholder={t('home.namePlaceholder')}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); }}
              maxLength={30}
              autoFocus={editingName}
            />
            <div className="home__gender-row">
              <span className="home__gender-label">{t('home.howToAddress')}</span>
              <div className="home__gender-btns">
                <button
                  type="button"
                  className={`home__gender-btn ${genderInput === 'm' ? 'home__gender-btn--on' : ''}`}
                  onClick={() => setGenderInput('m')}
                >
                  {t('home.genderM')}
                </button>
                <button
                  type="button"
                  className={`home__gender-btn ${genderInput === 'f' ? 'home__gender-btn--on' : ''}`}
                  onClick={() => setGenderInput('f')}
                >
                  {t('home.genderF')}
                </button>
              </div>
            </div>
            <div className="home__name-form-actions">
              <button type="button" className="home__name-save" onClick={handleNameSave}>
                {editingName ? t('home.update') : t('home.save')}
              </button>
              {editingName && (
                <button type="button" className="home__name-cancel" onClick={() => { setEditingName(false); setGenderInput(''); }}>
                  {t('home.cancel')}
                </button>
              )}
            </div>
          </div>
        )}

        <p className="home__subtitle">{t('home.subtitle')}</p>
      </div>

      {/* Personal strip: Daily Goal + Continue Playing */}
      <div className="home__personal-strip">
        {/* Daily Goal */}
        <div className="home__daily-goal card">
          <h3>{t('home.dailyGoal')}</h3>
          <div className="home__daily-goal-bar">
            <div className="home__daily-goal-fill" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="home__daily-goal-text">
            {goalPct >= 100
              ? t('home.goalDone')
              : t('home.goalProgress', { mins: goalMinutes, left: goalRemaining })}
          </p>
        </div>

        {/* Continue Playing */}
        {lastSong && (
          <Link to={`/songs?song=${lastSong.id}`} className="home__continue card">
            <span className="home__continue-icon">▶</span>
            <div className="home__continue-info">
              <h3>{t('home.continuePlaying')}</h3>
              <p>{(locale === 'en' ? lastSong.titleEn : lastSong.titleHe)} — {lastSong.artist}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Favorites */}
      {favSongs.length > 0 && (
        <div className="home__favorites">
          <h3 className="home__favorites-title">{t('home.myFavorites')}</h3>
          <div className="home__favorites-list">
            {favSongs.map((song) => (
              <Link key={song.id} to={`/songs?song=${song.id}`} className="home__favorites-item card">
                <span className="home__favorites-item-title">{locale === 'en' ? song.titleEn : song.titleHe}</span>
                <span className="home__favorites-item-artist">{song.artist}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="home__cotd card">
        <div className="home__cotd-text">
          <h2>{t('home.chordOfDay')}</h2>
          <p className="home__cotd-name">{chordOfTheDay.name}</p>
          <p className="home__cotd-he">{chordOfTheDay.nameHe}</p>
        </div>
        <div className="home__cotd-diagram">
          <ChordDiagram chord={chordOfTheDay} size={1.4} />
        </div>
      </div>

      {practiced.length > 0 && (
        <div className="home__progress card">
          <h3>{t('home.yourProgress')}</h3>
          <p>{t('home.practicedCount', { n: practiced.length, total: chords.length })}</p>
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
            <h3>{t(`nav.${section.titleKey}`)}</h3>
            <p>{t(`home.${section.descKey}`)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

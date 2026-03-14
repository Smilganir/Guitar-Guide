import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Feather } from 'lucide-react';
import { songs } from '../../data/songs';
import { strumPatterns } from '../../data/strumPatterns';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import '../../components/StrumPattern/StrumPattern.css';
import { useChordSound } from '../../hooks/useChordSound';
import { useSongPlayer } from '../../hooks/useSongPlayer';
import { useLocale } from '../../contexts/LocaleContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDailyGoal } from '../../hooks/useDailyGoal';
import songsIcon from '../../assets/Songs.svg';
import './Songs.css';

export default function Songs() {
  const { t, locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSong, setSelectedSong] = useState(() => {
    const songId = searchParams.get('song');
    if (songId) return songs.find((s) => s.id === songId) || null;
    return null;
  });
  const [easyMode, setEasyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { playChord } = useChordSound();

  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [, setLastPlayed] = useLocalStorage('last-played', null);
  const { markActive } = useDailyGoal();

  const activeSong = useMemo(() => {
    if (!selectedSong) return null;
    if (easyMode && selectedSong.easyProgression) {
      return { ...selectedSong, progression: selectedSong.easyProgression };
    }
    return selectedSong;
  }, [selectedSong, easyMode]);

  const player = useSongPlayer(activeSong, playChord);

  useEffect(() => {
    if (selectedSong) {
      setLastPlayed({ songId: selectedSong.id, timestamp: Date.now() });
    }
    if (searchParams.get('song')) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedSong, setLastPlayed, searchParams, setSearchParams]);

  useEffect(() => {
    markActive(player.phase === 'playing');
  }, [player.phase, markActive]);

  const toggleFavorite = (songId) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const patternDef = activeSong
    ? strumPatterns.find((p) => p.id === activeSong.patternId)
    : null;

  const hasEasy = selectedSong?.easyProgression;
  const activeNote = easyMode && selectedSong?.easyNote
    ? selectedSong.easyNote
    : selectedSong?.note || null;

  const filteredSongs = useMemo(() => {
    let list = songs;
    if (activeTab === 'israeli') list = list.filter((s) => s.category === 'israeli');
    else if (activeTab === 'international') list = list.filter((s) => s.category === 'international');
    else if (activeTab === 'favorites') list = list.filter((s) => favorites.includes(s.id));
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (s) =>
        s.titleHe.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
    );
  }, [searchQuery, activeTab, favorites]);

  const nextChordIndex = activeSong
    ? (player.chordIndex + 1) % activeSong.progression.length
    : 0;
  const nextChord = activeSong
    ? player.chordObjects[nextChordIndex] || null
    : null;

  const beatProgress = player.phase === 'playing' ? (player.beatInBar / 4) * 100 : 0;

  return (
    <div className="page fade-in page-songs">
      {/* Sidebar */}
      <aside className="songs__sidebar">
        <div className="songs__sidebar-header">
          <h2 className="songs__sidebar-title">{t('songs.title')}</h2>
          <span className="songs__sidebar-count">{filteredSongs.length}</span>
        </div>
        <div className="songs__sidebar-search-wrap">
          <span className="songs__sidebar-search-icon" aria-hidden>🔍</span>
          <input
            type="text"
            className="songs__sidebar-search"
            placeholder={t('songs.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <nav className="songs__tabs" role="tablist" aria-label={t('songs.title')}>
          {[
            { id: 'all', label: t('songs.tabAll') },
            { id: 'israeli', label: t('songs.tabIsraeli') },
            { id: 'international', label: t('songs.tabInternational') },
            { id: 'favorites', label: t('songs.tabFavorites') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`songs__tab ${activeTab === tab.id ? 'songs__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="songs__sidebar-list">
          {filteredSongs.map((song) => {
            const sp = strumPatterns.find((p) => p.id === song.patternId);
            const isFav = favorites.includes(song.id);
            return (
              <button
                key={song.id}
                type="button"
                className={`songs__sidebar-item ${selectedSong?.id === song.id ? 'songs__sidebar-item--active' : ''}`}
                onClick={() => {
                  setSelectedSong(selectedSong?.id === song.id ? null : song);
                  setEasyMode(false);
                }}
              >
                <span className="songs__sidebar-item-row">
                  <span className="songs__sidebar-item-title">{locale === 'en' ? song.titleEn : song.titleHe}</span>
                  <span className="songs__sidebar-item-artist">{song.artist}</span>
                </span>
                <span className="songs__sidebar-item-meta">
                  {song.bpm} BPM
                  {sp && <span className="songs__sidebar-item-strum"> · {locale === 'en' ? sp.nameEn : sp.name}</span>}
                </span>
                <span className="songs__sidebar-item-actions">
                  {song.easyProgression && (
                    <span className="songs__sidebar-item-easy" title={t('songs.easy')}>
                      <Feather className="songs__sidebar-item-easy-icon" size={18} />
                    </span>
                  )}
                  <span
                    className={`songs__sidebar-item-fav ${isFav ? 'songs__sidebar-item-fav--on' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); toggleFavorite(song.id); } }}
                    title={isFav ? t('songs.removeFromFav') : t('songs.addToFav')}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </span>
                </span>
              </button>
            );
          })}
          {filteredSongs.length === 0 && (
            <p className="songs__sidebar-empty">{t('songs.noSongs')}</p>
          )}
        </div>
      </aside>

      {/* Main player area */}
      <main className="songs__main">
        {!activeSong ? (
          <div className="songs__empty-state">
            <img src={songsIcon} alt="" className="songs__empty-state-icon" />
            <h2>{t('songs.selectSong')}</h2>
            <p>{t('songs.selectSongHint')}</p>
          </div>
        ) : (
          <div className="songs__player">
            {/* Header row */}
            <div className="songs__player-header">
              <div className="songs__player-header-info">
                <h2 className="songs__player-title">{locale === 'en' ? activeSong.titleEn : activeSong.titleHe}</h2>
                <p className="songs__player-subtitle">
                  {activeSong.titleEn !== activeSong.titleHe && `${activeSong.titleEn} · `}
                  {activeSong.artist}
                </p>
              </div>
              <div className="songs__player-header-actions">
                <span
                  className={`songs__player-fav ${favorites.includes(selectedSong.id) ? 'songs__player-fav--on' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFavorite(selectedSong.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') toggleFavorite(selectedSong.id); }}
                  title={favorites.includes(selectedSong.id) ? t('songs.removeFromFav') : t('songs.addToFav')}
                >
                  {favorites.includes(selectedSong.id) ? '❤️' : '🤍'}
                </span>
                {hasEasy && (
                  <button
                    type="button"
                    className={`songs__player-easy-toggle ${easyMode ? 'songs__player-easy-toggle--on' : ''}`}
                    onClick={() => {
                      if (player.phase !== 'idle') player.stop();
                      setEasyMode(!easyMode);
                    }}
                  >
                    {easyMode ? `🎓 ${t('songs.original')}` : (<><Feather className="songs__player-easy-icon" size={18} /> {t('songs.easy')}</>)}
                  </button>
                )}
              </div>
            </div>

            {activeNote && (
              <p className="songs__player-note">{activeNote}</p>
            )}

            {/* Beat progress bar (visual metronome) */}
            <div className="songs__beat-bar-track">
              <div
                className={`songs__beat-bar-fill ${player.phase === 'playing' ? 'songs__beat-bar-fill--active' : ''}`}
                style={{ width: `${beatProgress}%` }}
              />
              <div className="songs__beat-bar-markers">
                {[0, 1, 2, 3].map((b) => (
                  <span
                    key={b}
                    className={`songs__beat-bar-dot ${player.phase === 'playing' && Math.floor(player.beatInBar) === b ? 'songs__beat-bar-dot--on' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Chord spotlight */}
            <div className="songs__spotlight" dir="ltr">
              <div className="songs__spotlight-current">
                <span className="songs__spotlight-label">{t('songs.now')}</span>
                <span className="songs__spotlight-chord-name">
                  {activeSong.progression[player.chordIndex]}
                </span>
                <div className="songs__spotlight-diagram">
                  {player.chordObjects[player.chordIndex] && (
                    <ChordDiagram chord={player.chordObjects[player.chordIndex]} size={1.1} coloredFingers />
                  )}
                </div>
              </div>
              <div className="songs__spotlight-arrow" aria-hidden>→</div>
              <div className="songs__spotlight-next">
                <span className="songs__spotlight-label">{t('songs.next')}</span>
                <span className="songs__spotlight-next-name">
                  {activeSong.progression[nextChordIndex]}
                </span>
                {nextChord && (
                  <div className="songs__spotlight-diagram songs__spotlight-diagram--next">
                    <ChordDiagram chord={nextChord} size={0.65} coloredFingers />
                  </div>
                )}
              </div>
            </div>

            {/* Progression row */}
            <div className="songs__player-progression" dir="ltr">
              {activeSong.progression.map((id, i) => (
                <span key={`${id}-${i}`}>
                  <span
                    className={`songs__player-chord-name ${player.chordIndex === i && player.phase === 'playing' ? 'songs__player-chord-name--active' : ''}`}
                  >
                    {id}
                  </span>
                  {i < activeSong.progression.length - 1 && (
                    <span className="songs__player-progression-arrow" aria-hidden> → </span>
                  )}
                </span>
              ))}
            </div>

            {/* Strum pattern arrows */}
            {patternDef && (
              <div className="songs__player-strum">
                <p className="songs__player-strum-label">{locale === 'en' ? patternDef.nameEn : patternDef.name}</p>
                <div className="songs__player-strum-arrows">
                  {patternDef.pattern.map((item, i) => (
                    <div
                      key={i}
                      className={`strum-arrow strum-arrow--${item.type} ${item.isGhost ? 'strum-arrow--ghost' : ''} ${player.strumIndex === i && player.phase === 'playing' ? 'strum-arrow--active' : ''}`}
                    >
                      <span className="strum-arrow__icon">
                        {item.type === 'D' ? '↓' : item.type === 'U' ? '↑' : '•'}
                      </span>
                      <span className="strum-arrow__label">
                        {item.isGhost ? '( )' : item.type === 'D' ? 'D' : item.type === 'U' ? 'U' : 'x'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Count-in overlay */}
            {player.phase === 'countin' && (
              <div className="songs__player-countin">
                <span className="songs__player-countin-num">{player.countInBeat + 1}</span>
                <span className="songs__player-countin-text">{t('songs.preparing')}</span>
              </div>
            )}

            {/* Settings bar */}
            <div className="songs__settings-bar">
              <div className="songs__settings-bpm">
                <label className="songs__settings-label">BPM</label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="1"
                  value={player.effectiveBpm != null ? player.effectiveBpm : activeSong.bpm}
                  onChange={(e) => player.setBpmOffset(Number(e.target.value) - activeSong.bpm)}
                  disabled={player.phase === 'playing' || player.phase === 'countin'}
                  className="songs__settings-slider"
                />
                <span className="songs__settings-bpm-value">
                  {player.effectiveBpm != null ? player.effectiveBpm : activeSong.bpm}
                </span>
              </div>

              <label className="songs__settings-loop">
                <input
                  type="checkbox"
                  checked={player.loop}
                  onChange={(e) => player.setLoop(e.target.checked)}
                  disabled={player.phase === 'playing' || player.phase === 'countin'}
                />
                <span>{t('songs.loop')}</span>
              </label>

              <button
                type="button"
                className={`songs__settings-play-btn ${player.phase === 'playing' || player.phase === 'countin' ? 'songs__settings-play-btn--stop' : ''}`}
                onClick={() => (player.phase === 'playing' || player.phase === 'countin' ? player.stop() : player.start())}
              >
                {player.phase === 'countin' ? t('songs.starting') : player.phase === 'playing' ? t('songs.stop') : t('songs.play')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { theoryTopics } from '../../data/theory';
import { chords } from '../../data/chords';
import { songs } from '../../data/songs';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import { useLocale } from '../../contexts/LocaleContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './Theory.css';

const MAGIC_CHORDS = ['Am', 'F', 'C', 'G'];

export default function Theory() {
  const { t, locale } = useLocale();
  const [expandedId, setExpandedId] = useState(null);
  const [showMagicSongs, setShowMagicSongs] = useState(false);
  const [completed, setCompleted] = useLocalStorage('theory-completed', []);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  const toggleCompleted = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const magicChordObjects = MAGIC_CHORDS
    .map((name) => chords.find((c) => c.id === name))
    .filter(Boolean);

  const magicSongs = useMemo(
    () =>
      songs.filter((s) =>
        s.progression.every((ch) => MAGIC_CHORDS.includes(ch)) ||
        (s.easyProgression && s.easyProgression.every((ch) => MAGIC_CHORDS.includes(ch)))
      ),
    []
  );

  const titleKeyMap = { 'magic-chords': 'magicChords', 'capo-guide': 'capoGuide', 'chord-anatomy': 'chordAnatomy', 'keys-scales': 'keysScales' };
  const guideConfig = [
    { id: 'magic-chords', icon: '🪄', color: '#F6C28B', hasSongFilter: true },
    { id: 'capo-guide', icon: '🔧', color: '#A8D8EA' },
    { id: 'chord-anatomy', icon: '🎼', color: '#D5AAFF', hasDiagram: true },
    { id: 'keys-scales', icon: '👨‍👩‍👧‍👦', color: '#B5EAD7', hasFamilies: true },
  ];

  const anatomyParts = [
    { labelKey: 'anatomyRoot', descKey: 'anatomyRootDesc', example: 'C' },
    { labelKey: 'anatomy3rd', descKey: 'anatomy3rdDesc', example: 'E / E♭' },
    { labelKey: 'anatomy5th', descKey: 'anatomy5thDesc', example: 'G' },
  ];

  const familiesData = [
    { keyKey: 'keyC', chords: 'C — Dm — Em — F — G — Am — Bdim' },
    { keyKey: 'keyG', chords: 'G — Am — Bm — C — D — Em — F#dim' },
    { keyKey: 'keyAm', chords: 'Am — Bdim — C — Dm — Em — F — G' },
  ];

  return (
    <div className="page fade-in">
      <h1 className="page__title">{t('theory.title')}</h1>
      <p className="page__subtitle">{t('theory.subtitle')}</p>

      {/* New educational guide sections */}
      <div className="theory__guides">
        {guideConfig.map((section) => {
          const isDone = completed.includes(section.id);
          return (
            <div
              key={section.id}
              className={`card theory__guide ${locale === 'en' ? 'theory__guide--ltr' : ''}`}
              style={{ '--guide-color': section.color }}
              dir={locale === 'en' ? 'ltr' : undefined}
            >
              <div className="theory__guide-header">
                <div className="theory__guide-icon-wrap">
                  <span className="theory__guide-icon">{section.icon}</span>
                </div>
                <div>
                  <h2 className="theory__guide-title">{t(`theory.${titleKeyMap[section.id]}`)}</h2>
                  <span className="theory__guide-subtitle">{section.id === 'magic-chords' ? 'The Magic Chords' : section.id === 'capo-guide' ? 'The Capo Magic' : section.id === 'chord-anatomy' ? 'Anatomy of a Chord' : 'Keys & Scales'}</span>
                </div>
              </div>

              <p className="theory__guide-body">
                {section.id === 'magic-chords' && t('theory.magicBody')}
                {section.id === 'capo-guide' && t('theory.capoBody')}
                {section.id === 'chord-anatomy' && t('theory.anatomyBody')}
                {section.id === 'keys-scales' && t('theory.keysBody')}
              </p>

              {section.id === 'capo-guide' && (
                <div className="theory__guide-info-box">
                  <span className="theory__guide-info-icon">💡</span>
                  <p>{t('theory.capoInfo')}</p>
                </div>
              )}

              {section.hasDiagram && (
                <div className="theory__guide-anatomy">
                  {anatomyParts.map((part, i) => (
                    <div key={i} className="theory__guide-anatomy-item">
                      <span className="theory__guide-anatomy-num">{i + 1}</span>
                      <div>
                        <strong>{t(`theory.${part.labelKey}`)}</strong>
                        <p>{t(`theory.${part.descKey}`)}</p>
                        <span className="theory__guide-anatomy-example" dir="ltr">{part.example}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.hasFamilies && (
                <div className="theory__guide-families">
                  {familiesData.map((fam, i) => (
                    <div key={i} className="theory__guide-family-row">
                      <span className="theory__guide-family-key">{t(`theory.${fam.keyKey}`)}</span>
                      <span className="theory__guide-family-chords" dir="ltr">{fam.chords}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.hasSongFilter && (
                <div className="theory__guide-magic">
                  <div className="theory__guide-magic-chords">
                    {magicChordObjects.map((chord) => (
                      <div key={chord.id} className="theory__guide-magic-chord">
                        <ChordDiagram chord={chord} size={0.8} coloredFingers />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="theory__guide-songs-btn"
                    onClick={() => setShowMagicSongs(!showMagicSongs)}
                  >
                    {showMagicSongs ? t('theory.hideSongs') : t('theory.showSongs')}
                  </button>

                  {showMagicSongs && (
                    <div className="theory__guide-songs-list fade-in">
                      {magicSongs.length > 0 ? (
                        magicSongs.map((song) => (
                          <Link key={song.id} to={`/songs?song=${song.id}`} className="theory__guide-song-item">
                            <span className="theory__guide-song-title">{locale === 'en' ? song.titleEn : song.titleHe}</span>
                            <span className="theory__guide-song-artist">{song.artist}</span>
                            <span className="theory__guide-song-prog" dir="ltr">
                              {(song.progression.every((ch) => MAGIC_CHORDS.includes(ch))
                                ? song.progression
                                : song.easyProgression
                              ).join(' → ')}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="theory__guide-songs-empty">{t('theory.noMagicSongs')}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Completed check */}
              <button
                type="button"
                className={`theory__guide-check ${isDone ? 'theory__guide-check--done' : ''}`}
                onClick={() => toggleCompleted(section.id)}
              >
                {isDone ? `✅ ${t('theory.read')}` : `☐ ${t('theory.markRead')}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Existing chord-type theory topics */}
      <h2 className="theory__section-heading">{t('theory.chordTypes')}</h2>

      <div className="theory__topics">
        {theoryTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const exampleChords = topic.examples
            .map((name) => chords.find((c) => c.id === name))
            .filter(Boolean);

          return (
            <div
              key={topic.id}
              className={`card theory__card ${isExpanded ? 'theory__card--expanded' : ''} ${locale === 'en' ? 'theory__card--ltr' : ''}`}
              style={{ '--topic-color': topic.color }}
              dir={locale === 'en' ? 'ltr' : undefined}
            >
              <div className="theory__card-header" onClick={() => toggle(topic.id)}>
                <div className="theory__card-icon-wrap">
                  <span className="theory__card-icon">{topic.icon}</span>
                </div>
                <div className="theory__card-header-text">
                  <h2 className="theory__card-title">{locale === 'en' && topic.titleEn ? topic.titleEn : topic.title}</h2>
                  <p className="theory__card-summary">{locale === 'en' && topic.summaryEn ? topic.summaryEn : topic.summary}</p>
                </div>
                <span className={`theory__card-chevron ${isExpanded ? 'theory__card-chevron--open' : ''}`}>
                  {locale === 'en' ? '▶' : '◀'}
                </span>
              </div>

              {isExpanded && (
                <div className="theory__card-body fade-in">
                  <div className="theory__formula-box">
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">{t('theory.formula')}</span>
                      <span>{locale === 'en' && topic.formulaEn ? topic.formulaEn : topic.formula}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">{t('theory.intervals')}</span>
                      <span dir="ltr" className="theory__intervals">{topic.intervals}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">{t('theory.semitones')}</span>
                      <span dir="ltr" className="theory__intervals">{topic.semitones}</span>
                    </div>
                  </div>

                  <div className="theory__explanation">
                    {(locale === 'en' && topic.explanationEn ? topic.explanationEn : topic.explanation).split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {exampleChords.length > 0 && (
                    <div className="theory__examples">
                      <h3>{t('theory.examples')}:</h3>
                      <div className="theory__examples-grid">
                        {exampleChords.map((chord) => (
                          <div key={chord.id} className="theory__example-chord">
                            <ChordDiagram chord={chord} size={0.9} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

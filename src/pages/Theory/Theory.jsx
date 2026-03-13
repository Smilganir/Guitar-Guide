import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { theoryTopics } from '../../data/theory';
import { chords } from '../../data/chords';
import { songs } from '../../data/songs';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './Theory.css';

const MAGIC_CHORDS = ['Am', 'F', 'C', 'G'];

const guideSections = [
  {
    id: 'magic-chords',
    icon: '🪄',
    color: '#F6C28B',
    title: 'סוד 4 האקורדים',
    subtitle: 'The Magic Chords',
    body: 'שמת לב שרוב השירים באפליקציה משתמשים ב-Am, F, C, G? זה לא במקרה! במוזיקת פופ, יש נוסחת קסם של ארבעה אקורדים שפשוט עובדים מושלם ביחד. ברגע שאת לומדת את ארבעת אלו, את פותחת את הדלת לאלפי שירים.',
    hasSongFilter: true,
  },
  {
    id: 'capo-guide',
    icon: '🔧',
    color: '#A8D8EA',
    title: 'מדריך הקאפו',
    subtitle: 'The Capo Magic',
    body: 'הקאפו הוא כמו אצבע חמישית שעוזרת לנו. הוא לוחץ על כל המיתרים בבת אחת ומקצר את הצוואר של הגיטרה. אם שיר קשה מדי לנגינה או גבוה מדי לשירה, פשוט שמים קאפו והכל מסתדר!',
    infoBox: 'קאפו בסריג 1 מעלה את הכל בחצי טון. קאפו בסריג 2 = טון שלם. כל סריג = עוד חצי טון.',
  },
  {
    id: 'chord-anatomy',
    icon: '🎼',
    color: '#D5AAFF',
    title: 'איך נולד אקורד?',
    subtitle: 'Anatomy of a Chord',
    body: 'אקורד הוא לא סתם אוסף צלילים. הוא בנוי משלושה צלילים עיקריים: השורש (השם של האקורד), הטרצה (שקובעת אם הוא שמח או עצוב) והקווינטה (העוצמה). כשתלחצי על הגיטרה, את משמיעה את שלושתם יחד.',
    diagram: [
      { label: 'שורש (Root)', desc: 'השם של האקורד — הנוטה הבסיסית', example: 'C' },
      { label: 'טרצה (3rd)', desc: 'קובעת מז\'ור (שמח) או מינור (עצוב)', example: 'E / E♭' },
      { label: 'קווינטה (5th)', desc: 'נותנת עוצמה ויציבות', example: 'G' },
    ],
  },
  {
    id: 'keys-scales',
    icon: '👨‍👩‍👧‍👦',
    color: '#B5EAD7',
    title: 'משפחות של אקורדים',
    subtitle: 'Keys & Scales',
    body: 'במוזיקה, אקורדים הם כמו בני משפחה – יש כאלו שמסתדרים מצוין ביחד. ה"משפחה" הזו נקראת סולם. לדעת את המשפחות עוזר לך לנחש מה יהיה האקורד הבא בשיר אפילו בלי להסתכל בדף!',
    families: [
      { key: 'סולם C מז\'ור', chords: 'C — Dm — Em — F — G — Am — Bdim' },
      { key: 'סולם G מז\'ור', chords: 'G — Am — Bm — C — D — Em — F#dim' },
      { key: 'סולם Am מינור', chords: 'Am — Bdim — C — Dm — Em — F — G' },
    ],
  },
];

export default function Theory() {
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

  return (
    <div className="page fade-in">
      <h1 className="page__title">תיאוריה מוזיקלית</h1>
      <p className="page__subtitle">הבינו איך אקורדים בנויים ומה ההבדל ביניהם</p>

      {/* New educational guide sections */}
      <div className="theory__guides">
        {guideSections.map((section) => {
          const isDone = completed.includes(section.id);
          return (
            <div
              key={section.id}
              className="card theory__guide"
              style={{ '--guide-color': section.color }}
            >
              <div className="theory__guide-header">
                <div className="theory__guide-icon-wrap">
                  <span className="theory__guide-icon">{section.icon}</span>
                </div>
                <div>
                  <h2 className="theory__guide-title">{section.title}</h2>
                  <span className="theory__guide-subtitle">{section.subtitle}</span>
                </div>
              </div>

              <p className="theory__guide-body">{section.body}</p>

              {/* Info box (Capo section) */}
              {section.infoBox && (
                <div className="theory__guide-info-box">
                  <span className="theory__guide-info-icon">💡</span>
                  <p>{section.infoBox}</p>
                </div>
              )}

              {/* Chord anatomy diagram */}
              {section.diagram && (
                <div className="theory__guide-anatomy">
                  {section.diagram.map((part, i) => (
                    <div key={i} className="theory__guide-anatomy-item">
                      <span className="theory__guide-anatomy-num">{i + 1}</span>
                      <div>
                        <strong>{part.label}</strong>
                        <p>{part.desc}</p>
                        <span className="theory__guide-anatomy-example" dir="ltr">{part.example}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Families / scales table */}
              {section.families && (
                <div className="theory__guide-families">
                  {section.families.map((fam, i) => (
                    <div key={i} className="theory__guide-family-row">
                      <span className="theory__guide-family-key">{fam.key}</span>
                      <span className="theory__guide-family-chords" dir="ltr">{fam.chords}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Magic chords diagrams + song filter */}
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
                    {showMagicSongs ? 'הסתר שירים' : 'הצג שירים לדוגמה'}
                  </button>

                  {showMagicSongs && (
                    <div className="theory__guide-songs-list fade-in">
                      {magicSongs.length > 0 ? (
                        magicSongs.map((song) => (
                          <Link key={song.id} to="/songs" className="theory__guide-song-item">
                            <span className="theory__guide-song-title">{song.titleHe}</span>
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
                        <p className="theory__guide-songs-empty">אין שירים שמשתמשים רק ב-4 האקורדים האלה (כולל גרסאות קלות).</p>
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
                {isDone ? '✅ קראתי' : '☐ סמן כנקרא'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Existing chord-type theory topics */}
      <h2 className="theory__section-heading">סוגי אקורדים</h2>

      <div className="theory__topics">
        {theoryTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const exampleChords = topic.examples
            .map((name) => chords.find((c) => c.id === name))
            .filter(Boolean);

          return (
            <div
              key={topic.id}
              className={`card theory__card ${isExpanded ? 'theory__card--expanded' : ''}`}
              style={{ '--topic-color': topic.color }}
            >
              <div className="theory__card-header" onClick={() => toggle(topic.id)}>
                <div className="theory__card-icon-wrap">
                  <span className="theory__card-icon">{topic.icon}</span>
                </div>
                <div className="theory__card-header-text">
                  <h2 className="theory__card-title">{topic.title}</h2>
                  <p className="theory__card-summary">{topic.summary}</p>
                </div>
                <span className={`theory__card-chevron ${isExpanded ? 'theory__card-chevron--open' : ''}`}>
                  ◀
                </span>
              </div>

              {isExpanded && (
                <div className="theory__card-body fade-in">
                  <div className="theory__formula-box">
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">נוסחה:</span>
                      <span>{topic.formula}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">מרווחים:</span>
                      <span dir="ltr" className="theory__intervals">{topic.intervals}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">חצאי טונים:</span>
                      <span dir="ltr" className="theory__intervals">{topic.semitones}</span>
                    </div>
                  </div>

                  <div className="theory__explanation">
                    {topic.explanation.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {exampleChords.length > 0 && (
                    <div className="theory__examples">
                      <h3>דוגמאות:</h3>
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

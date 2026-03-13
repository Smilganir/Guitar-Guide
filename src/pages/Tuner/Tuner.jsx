import { useTuner } from '../../hooks/useTuner';
import './Tuner.css';

function centsToStatus(cents) {
  const abs = Math.abs(cents);
  if (abs <= 5) return 'in-tune';
  if (abs <= 15) return 'close';
  return 'off';
}

export default function Tuner() {
  const {
    STRINGS,
    listening,
    detected,
    refPlaying,
    micError,
    startListening,
    stopListening,
    playReference,
  } = useTuner();

  const status = detected ? centsToStatus(detected.cents) : null;

  return (
    <div className="page fade-in page-tuner">
      <h1 className="page__title">כוונון גיטרה</h1>
      <p className="page__subtitle">כוונו את הגיטרה בעזרת מיקרופון או בהשמעת צליל ייחוס</p>

      <div className="tuner__strings card">
        <p className="tuner__section-label">צליל ייחוס — לחצו על מיתר להשמעה</p>
        <div className="tuner__strings-row">
          {STRINGS.map((s) => (
            <button
              key={s.index}
              type="button"
              className={`tuner__string-btn ${refPlaying?.index === s.index ? 'tuner__string-btn--active' : ''} ${detected?.closestString?.index === s.index && listening ? 'tuner__string-btn--detected' : ''}`}
              onClick={() => playReference(s)}
            >
              <span className="tuner__string-note">{s.note}{s.octave}</span>
              <span className="tuner__string-label">מיתר {s.label}</span>
              <span className="tuner__string-hz">{s.freq.toFixed(1)} Hz</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tuner__mic card">
        <p className="tuner__section-label">כוונון עם מיקרופון</p>

        <button
          type="button"
          className={`tuner__mic-btn ${listening ? 'tuner__mic-btn--active' : ''}`}
          onClick={() => (listening ? stopListening() : startListening())}
        >
          {listening ? '🎙️ מקשיב... לחצו לעצירה' : '🎙️ הפעלת מיקרופון'}
        </button>

        {micError === 'denied' && (
          <p className="tuner__mic-error">הגישה למיקרופון נדחתה. אנא אפשרו גישה בהגדרות הדפדפן.</p>
        )}
        {micError === 'error' && (
          <p className="tuner__mic-error">לא ניתן לגשת למיקרופון. ודאו שהוא מחובר ונסו שוב.</p>
        )}

        {listening && (
          <div className="tuner__display">
            {detected ? (
              <>
                <div className={`tuner__note-name tuner__note-name--${status}`}>
                  {detected.name}{detected.octave}
                </div>

                <div className="tuner__gauge">
                  <div className="tuner__gauge-track">
                    <div className="tuner__gauge-labels">
                      <span>-50</span>
                      <span>0</span>
                      <span>+50</span>
                    </div>
                    <div className="tuner__gauge-bar">
                      <div className="tuner__gauge-center" />
                      <div
                        className={`tuner__gauge-needle tuner__gauge-needle--${status}`}
                        style={{ left: `${50 + detected.cents}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className={`tuner__cents tuner__cents--${status}`}>
                  {detected.cents > 0 ? '+' : ''}{detected.cents.toFixed(1)} cents
                </div>

                <div className={`tuner__status tuner__status--${status}`}>
                  {status === 'in-tune' && '✅ מכוון!'}
                  {status === 'close' && '🔶 כמעט שם...'}
                  {status === 'off' && (detected.cents > 0 ? '⬇️ גבוה מדי — רפו' : '⬆️ נמוך מדי — הדקו')}
                </div>

                {detected.closestString && (
                  <div className="tuner__closest-string">
                    הכי קרוב למיתר {detected.closestString.label} ({detected.closestString.note}{detected.closestString.octave})
                  </div>
                )}

                <div className="tuner__freq">
                  {detected.frequency.toFixed(1)} Hz
                </div>
              </>
            ) : (
              <div className="tuner__waiting">
                <span className="tuner__waiting-icon">🎸</span>
                <span>נגנו על מיתר...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

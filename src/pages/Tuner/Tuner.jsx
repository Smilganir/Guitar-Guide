import { useTuner } from '../../hooks/useTuner';
import { useLocale } from '../../contexts/LocaleContext';
import guitarIcon from '../../assets/Guitar.svg';
import './Tuner.css';

function centsToStatus(cents) {
  const abs = Math.abs(cents);
  if (abs <= 5) return 'in-tune';
  if (abs <= 15) return 'close';
  return 'off';
}

export default function Tuner() {
  const { t } = useLocale();
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
      <h1 className="page__title">{t('tuner.title')}</h1>
      <p className="page__subtitle">{t('tuner.subtitle')}</p>

      <div className="tuner__strings card">
        <p className="tuner__section-label">{t('tuner.referenceLabel')}</p>
        <div className="tuner__strings-row">
          {STRINGS.map((s) => (
            <button
              key={s.index}
              type="button"
              className={`tuner__string-btn ${refPlaying?.index === s.index ? 'tuner__string-btn--active' : ''} ${detected?.closestString?.index === s.index && listening ? 'tuner__string-btn--detected' : ''}`}
              onClick={() => playReference(s)}
            >
              <span className="tuner__string-note">{s.note}{s.octave}</span>
              <span className="tuner__string-label">{t('tuner.string')} {s.label}</span>
              <span className="tuner__string-hz">{s.freq.toFixed(1)} Hz</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tuner__mic card">
        <p className="tuner__section-label">{t('tuner.micLabel')}</p>

        <button
          type="button"
          className={`tuner__mic-btn ${listening ? 'tuner__mic-btn--active' : ''}`}
          onClick={() => (listening ? stopListening() : startListening())}
        >
          {listening ? t('tuner.micListening') : t('tuner.micStart')}
        </button>

        {micError === 'denied' && (
          <p className="tuner__mic-error">{t('tuner.micDenied')}</p>
        )}
        {micError === 'error' && (
          <p className="tuner__mic-error">{t('tuner.micError')}</p>
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
                  {status === 'in-tune' && t('tuner.inTune')}
                  {status === 'close' && t('tuner.close')}
                  {status === 'off' && (detected.cents > 0 ? t('tuner.tooHigh') : t('tuner.tooLow'))}
                </div>

                {detected.closestString && (
                  <div className="tuner__closest-string">
                    {t('tuner.closestTo')} {detected.closestString.label} ({detected.closestString.note}{detected.closestString.octave})
                  </div>
                )}

                <div className="tuner__freq">
                  {detected.frequency.toFixed(1)} Hz
                </div>
              </>
            ) : (
              <div className="tuner__waiting">
                <img src={guitarIcon} alt="" className="tuner__waiting-icon" />
                <span>{t('tuner.playString')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

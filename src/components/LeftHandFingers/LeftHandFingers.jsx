import { useState } from 'react';
import { FINGER_COLORS } from '../../constants/fingerColors';
import { useLocale } from '../../contexts/LocaleContext';
import './LeftHandFingers.css';

// Left hand, inner palm facing viewer (guitarist's POV looking down at fretting hand)
// Index (1) on the left, pinky (4) on the right, thumb on left edge
const FINGERS = [
  { id: 1, x: 22, tipY: 8,  baseY: 52 },  // index — leftmost, tallest
  { id: 2, x: 38, tipY: 4,  baseY: 50 },  // middle — tallest
  { id: 3, x: 54, tipY: 10, baseY: 52 },  // ring
  { id: 4, x: 68, tipY: 22, baseY: 56 },  // pinky — rightmost, shortest
];

const FW = 12; // finger width

const FINGER_KEYS = { 1: 'finger1', 2: 'finger2', 3: 'finger3', 4: 'finger4' };

export default function LeftHandFingers() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="finger-legend">
      <button
        className="finger-legend__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span>🖐 {t('chords.fingerLegend')}</span>
        <span className={`finger-legend__chevron ${open ? 'finger-legend__chevron--open' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="finger-legend__body">
          <svg
            className="finger-legend__svg"
            width="90"
            height="78"
            viewBox="0 0 90 78"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Clip the bottom so the palm fades out without a visible edge */}
            <defs>
              <clipPath id="palmClip">
                <rect x="0" y="0" width="90" height="78" />
              </clipPath>
            </defs>
            <g clipPath="url(#palmClip)">
            {/* Palm — extends beyond viewBox bottom, clipped off */}
            <rect
              x="12" y="54" width="66" height="40" rx="14"
              fill="var(--bg-secondary)"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
            />
            {/* Palm crease */}
            <path
              d="M 26 64 Q 45 58 64 64"
              fill="none" stroke="var(--text-secondary)" strokeWidth="0.7" opacity="0.35"
            />

            {/* Thumb — small stub on left */}
            <rect
              x="2" y="52" width="10" height="24" rx="5"
              fill="var(--bg-secondary)"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              transform="rotate(-20 7 64)"
            />

            {/* Four fingers */}
            {FINGERS.map(({ id, x, tipY, baseY }) => (
              <g key={id}>
                <rect
                  x={x - FW / 2}
                  y={tipY + 12}
                  width={FW}
                  height={baseY - tipY - 6}
                  rx="5.5"
                  fill="var(--bg-secondary)"
                  stroke="var(--text-secondary)"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx={x}
                  cy={tipY + 9}
                  rx={FW / 2 + 1}
                  ry="10"
                  fill={FINGER_COLORS[id]}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={tipY + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="white"
                >
                  {id}
                </text>
              </g>
            ))}
            </g>
          </svg>

          {/* Finger key labels */}
          <div className="finger-legend__keys">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="finger-legend__key">
                <span
                  className="finger-legend__dot"
                  style={{ background: FINGER_COLORS[id] }}
                >
                  {id}
                </span>
                <span className="finger-legend__key-name">{t(`chords.${FINGER_KEYS[id]}`)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

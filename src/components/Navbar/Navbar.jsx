import { NavLink } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import './Navbar.css';

const linkKeys = [
  { to: '/', key: 'home', icon: '🏠' },
  { to: '/tuner', key: 'tuner', icon: '🎯' },
  { to: '/theory', key: 'theory', icon: '📖' },
  { to: '/chords', key: 'chords', icon: '🎸' },
  { to: '/strumming', key: 'strumming', icon: '🎵' },
  { to: '/songs', key: 'songs', icon: '🎤' },
  { to: '/practice', key: 'practice', icon: '⏱️' },
];

export default function Navbar() {
  const { t, locale, toggleLocale } = useLocale();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🎸</span>
        <span className="navbar__title">{t('nav.brand')}</span>
      </div>
      <div className="navbar__links">
        {linkKeys.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            end={link.to === '/'}
          >
            <span className="navbar__link-icon">{link.icon}</span>
            <span className="navbar__link-label">{t(`nav.${link.key}`)}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="navbar__lang-toggle"
          onClick={toggleLocale}
          title={locale === 'he' ? 'Switch to English' : 'עבור לעברית'}
        >
          {locale === 'he' ? 'EN' : 'עב'}
        </button>
      </div>
    </nav>
  );
}

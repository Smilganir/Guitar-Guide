import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/', label: 'בית', icon: '🏠' },
  { to: '/chords', label: 'אקורדים', icon: '🎸' },
  { to: '/theory', label: 'תיאוריה', icon: '📖' },
  { to: '/strumming', label: 'פריטה', icon: '🎵' },
  { to: '/songs', label: 'שירים', icon: '🎤' },
  { to: '/practice', label: 'תרגול', icon: '⏱️' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🎸</span>
        <span className="navbar__title">מדריך גיטרה</span>
      </div>
      <div className="navbar__links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            end={link.to === '/'}
          >
            <span className="navbar__link-icon">{link.icon}</span>
            <span className="navbar__link-label">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

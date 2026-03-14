import { NavLink } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import {
  HomeIcon,
  TunerIcon,
  TheoryIcon,
  ChordsIcon,
  StrummingIcon,
  SongsIcon,
  PracticeIcon,
} from '../Icons/Icons';
import guitarIcon from '../../assets/Guitar.svg';
import './Navbar.css';

const linkKeys = [
  { to: '/', key: 'home', Icon: HomeIcon },
  { to: '/tuner', key: 'tuner', Icon: TunerIcon },
  { to: '/theory', key: 'theory', Icon: TheoryIcon },
  { to: '/chords', key: 'chords', Icon: ChordsIcon },
  { to: '/strumming', key: 'strumming', Icon: StrummingIcon },
  { to: '/songs', key: 'songs', Icon: SongsIcon },
  { to: '/practice', key: 'practice', Icon: PracticeIcon },
];

export default function Navbar() {
  const { t, locale, toggleLocale } = useLocale();

  return (
    <nav className="navbar">
      <div className="navbar__top">
        <button
          type="button"
          className="navbar__lang-toggle"
          onClick={toggleLocale}
          title={locale === 'he' ? 'Switch to English' : 'עבור לעברית'}
        >
          {locale === 'he' ? 'EN' : 'עב'}
        </button>
        <div className="navbar__brand">
          <img src={guitarIcon} alt="" className="navbar__brand-icon" />
          <span className="navbar__title">{t('nav.brand')}</span>
        </div>
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
            <span className="navbar__link-icon"><link.Icon /></span>
            <span className="navbar__link-label">{t(`nav.${link.key}`)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { translations } from '../i18n/translations';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useLocalStorage('locale', 'he');

  const t = (key, vars = {}) => {
    const keys = key.split('.');
    let val = translations[locale];
    for (const k of keys) val = val?.[k];
    if (typeof val !== 'string') return key;
    return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), val);
  };

  const toggleLocale = () => setLocale((l) => (l === 'he' ? 'en' : 'he'));

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

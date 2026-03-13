import { Routes, Route } from 'react-router-dom';
import { useLocale } from './contexts/LocaleContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Chords from './pages/Chords/Chords';
import Theory from './pages/Theory/Theory';
import Strumming from './pages/Strumming/Strumming';
import Practice from './pages/Practice/Practice';
import Songs from './pages/Songs/Songs';
import Tuner from './pages/Tuner/Tuner';

export default function App() {
  const { locale } = useLocale();

  return (
    <div dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chords" element={<Chords />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/strumming" element={<Strumming />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/tuner" element={<Tuner />} />
      </Routes>
    </div>
  );
}

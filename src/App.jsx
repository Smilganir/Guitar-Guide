import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Chords from './pages/Chords/Chords';
import Theory from './pages/Theory/Theory';
import Strumming from './pages/Strumming/Strumming';
import Practice from './pages/Practice/Practice';
import Songs from './pages/Songs/Songs';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chords" element={<Chords />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/strumming" element={<Strumming />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/songs" element={<Songs />} />
      </Routes>
    </>
  );
}

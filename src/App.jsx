import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BespokeExperiencePage from './pages/BespokeExperiencePage';
import './App.css';

function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience" element={<BespokeExperiencePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

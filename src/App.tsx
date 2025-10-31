// ...existing code...
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <>
      <nav className="flex justify-center gap-4 p-4 border-b mb-4">
        <Link to="/" className="font-medium">
          Home
        </Link>
        <Link to="/about" className="font-medium">
          About
        </Link>
      </nav>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

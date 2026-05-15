import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">To-Do List v2</Link>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}

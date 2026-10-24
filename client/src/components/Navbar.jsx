import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, setLanguage } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="nav">
      <Link to="/" className="brand">🏛 Heritage Guide</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/ar">Scan QR</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <select value={user.language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <button onClick={() => { logout(); nav('/login'); }}>Logout</button>
          </>
        ) : (<><Link to="/login">Login</Link><Link to="/register">Register</Link></>)}
      </div>
    </nav>
  );
}
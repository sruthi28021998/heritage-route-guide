import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const { authenticate } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try { await authenticate('login', f); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
  };
  return (
    <form className="card form" onSubmit={submit}>
      <h2>Login</h2>
      {err && <p className="error">{err}</p>}
      <input type="email" placeholder="Email" required onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" placeholder="Password" required onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button>Login</button>
      <p>No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '', language: 'en' });
  const [err, setErr] = useState('');
  const { authenticate } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try { await authenticate('register', f); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Registration failed'); }
  };
  return (
    <form className="card form" onSubmit={submit}>
      <h2>Register</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Name" required onChange={set('name')} />
      <input type="email" placeholder="Email" required onChange={set('email')} />
      <input type="password" placeholder="Password (min 6)" minLength={6} required onChange={set('password')} />
      <select onChange={set('language')}><option value="en">English</option><option value="hi">हिन्दी</option></select>
      <button>Create account</button>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
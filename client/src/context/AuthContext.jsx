import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const setLanguage = async (language) => setUser((await api.put('/auth/language', { language })).data);
  const toggleFav = async (id) => setUser((await api.post(`/auth/favorites/${id}`)).data);

  return <Ctx.Provider value={{ user, loading, authenticate, logout, setLanguage, toggleFav }}>{children}</Ctx.Provider>;
}
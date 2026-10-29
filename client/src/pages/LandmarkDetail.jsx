import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function LandmarkDetail() {
  const { id } = useParams();
  const { user, toggleFav } = useAuth();
  const [l, setL] = useState(null);
  const [rating, setRating] = useState({ avg: 0, count: 0, mine: 0 });
  const routeRef = useRef(null);
  const start = useRef(Date.now());
  const sid = useRef(sessionStorage.getItem('sid') || crypto.randomUUID());

  const loadRating = () => api.get(`/ratings/${id}`).then((r) => setRating(r.data)).catch(() => {});

  useEffect(() => {
    sessionStorage.setItem('sid', sid.current);
    start.current = Date.now();
    api.get(`/landmarks/${id}`).then((r) => {
      setL(r.data);
      routeRef.current = r.data.route;
      api.post(`/landmarks/${id}/visit`).catch(() => {});
      api.post('/analytics/track', { sessionId: sid.current, landmark: id, route: r.data.route, type: 'view' }).catch(() => {});
    });
    loadRating();
    return () => {
      api.post('/analytics/track', {
        sessionId: sid.current, landmark: id, route: routeRef.current, type: 'view',
        duration: Math.round((Date.now() - start.current) / 1000),
      }).catch(() => {});
    };
  }, [id]);

  const rate = async (stars) => { await api.post('/ratings', { landmark: id, stars }); loadRating(); };

  if (!l) return <p>Loading...</p>;
  const lang = user.language;
  const fav = user.favorites.includes(l._id);

  return (
    <div className="card">
      <Link to={`/map/${l.route}`}>← Back to map</Link>
      <h2>{l.name} <button className="ghost" onClick={() => toggleFav(l._id)}>{fav ? '❤️' : '🤍'}</button></h2>
      {l.images?.[0] && <img className="hero" src={l.images[0]} alt={l.name} onError={(e) => { e.target.style.display = 'none'; }} />}
      <p>{l.description?.[lang] || l.description?.en}</p>

      {l.audioUrl?.[lang] && <audio controls src={l.audioUrl[lang]} />}
      {l.videoUrl && <video controls width="100%" src={l.videoUrl} />}

      <h3>Timeline</h3>
      <ul className="timeline">
        {l.timeline.map((t, i) => (
          <li key={i} style={{ animationDelay: `${i * 0.4}s` }}><b>{t.year}</b> — {t.event}</li>
        ))}
      </ul>

      {l.character?.name && <blockquote><b>{l.character.name}:</b> “{l.character.quote}”</blockquote>}
      {l.modelUrl && <model-viewer src={l.modelUrl} alt="3D model" camera-controls auto-rotate ar style={{ width: '100%', height: 300 }} />}

      <Link to={`/ar/${l._id}`}><button>🔍 Enable AR Camera Mode</button></Link>

      <h3>Rate this experience</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} onClick={() => rate(s)} style={{ cursor: 'pointer', fontSize: '1.8rem', color: s <= rating.mine ? '#f5a623' : '#ccc' }}>★</span>
        ))}
      </div>
      <small>Average: {rating.avg || '–'} / 5 ({rating.count} ratings)</small>
    </div>
  );
}
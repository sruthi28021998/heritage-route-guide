import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function List({ title, items, empty }) {
  return (
    <>
      <h3>{title}</h3>
      {items.length === 0 && <p>{empty}</p>}
      <div className="grid">
        {items.map((l) => (
          <Link key={l._id} to={`/landmark/${l._id}`} className="card">
            {l.images?.[0] && <img className="thumb" src={l.images[0]} alt={l.name} />}
            <h4>{l.name}</h4>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function Journey() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/auth/journey').then((r) => setData(r.data)).catch(() => setErr('Could not load your journey'));
  }, []);

  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <h2>My Journey</h2>
      <List title="❤️ Favorite landmarks" items={data.favorites} empty="No favorites yet. Tap the heart on a landmark page." />
      <List title="✅ Unlocked landmarks" items={data.visited} empty="Visit a landmark to unlock its story." />
    </>
  );
}
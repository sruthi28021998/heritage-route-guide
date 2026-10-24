import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function RouteSelection() {
  const [routes, setRoutes] = useState([]);
  useEffect(() => { api.get('/routes').then((r) => setRoutes(r.data)); }, []);
  return (
    <>
      <h2>Select a Heritage Route</h2>
      <div className="grid">
        {routes.map((r) => (
          <Link key={r._id} to={`/map/${r._id}`} className="card">
            <h3>{r.name}</h3>
            <small>📍 {r.city}</small>
            <p>{r.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
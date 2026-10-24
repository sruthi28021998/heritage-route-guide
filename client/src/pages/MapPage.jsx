import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { distanceM } from '../utils/geo';

L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: shadow, iconSize: [25, 41], iconAnchor: [12, 41] });
const TRIGGER_RADIUS_M = 200;

export default function MapPage() {
  const { routeId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [pos, setPos] = useState(null);
  const [sim, setSim] = useState('');

  useEffect(() => { api.get(`/routes/${routeId}`).then((r) => setData(r.data)); }, [routeId]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]), () => {}, { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  if (!data) return <p>Loading...</p>;
  const { route, landmarks } = data;
  const pts = landmarks.map((l) => [l.lat, l.lng]);
  const simLm = landmarks.find((l) => l._id === sim);
  const current = simLm ? [simLm.lat, simLm.lng] : pos;
  const nearby = current ? landmarks.filter((l) => distanceM(current, [l.lat, l.lng]) <= TRIGGER_RADIUS_M) : [];

  return (
    <>
      <h2>{route.name}</h2>

      {nearby.map((l) => (
        <div key={l._id} className="card ok-banner">
          📍 You are near <b>{l.name}</b>!{' '}
          <Link to={`/ar/${l._id}`}><button>Unlock AR story</button></Link>
        </div>
      ))}

      <MapContainer center={pts[0] || [28.61, 77.23]} zoom={11} className="map">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={pts} />
        {current && <CircleMarker center={current} radius={9} pathOptions={{ color: '#1a73e8' }} />}
        {landmarks.map((l) => (
          <Marker key={l._id} position={[l.lat, l.lng]}>
            <Popup>
              <b>{l.name}</b><br />
              <Link to={`/landmark/${l._id}`}>Open story</Link> · <Link to={`/ar/${l._id}`}>AR mode</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <label>Demo: simulate my location{' '}
        <select value={sim} onChange={(e) => setSim(e.target.value)}>
          <option value="">Use real GPS</option>
          {landmarks.map((l) => <option key={l._id} value={l._id}>At {l.name}</option>)}
        </select>
      </label>

      <h3>Landmarks</h3>
      <div className="grid">
        {landmarks.map((l) => (
          <Link key={l._id} to={`/landmark/${l._id}`} className="card">
            <h4>{l.order}. {l.name} {user.visited.includes(l._id) && '✅'} {user.favorites.includes(l._id) && '❤️'}</h4>
          </Link>
        ))}
      </div>
    </>
  );
}
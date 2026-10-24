import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../api';

const emptyL = { route: '', name: '', lat: '', lng: '', en: '', hi: '', image: '', modelUrl: '', videoUrl: '', audioEn: '', audioHi: '', timeline: '', charName: '', charQuote: '' };

const toForm = (l) => ({
  route: l.route, name: l.name, lat: l.lat, lng: l.lng,
  en: l.description?.en || '', hi: l.description?.hi || '',
  image: l.images?.[0] || '', modelUrl: l.modelUrl || '', videoUrl: l.videoUrl || '',
  audioEn: l.audioUrl?.en || '', audioHi: l.audioUrl?.hi || '',
  timeline: (l.timeline || []).map((t) => `${t.year}|${t.event}`).join('; '),
  charName: l.character?.name || '', charQuote: l.character?.quote || '',
});

function FileField({ label, value, onChange, accept }) {
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setBusy(true);
    try { const { data } = await api.post('/upload', fd); onChange(data.url); }
    catch (err) { alert(err.response?.data?.message || 'Upload failed'); }
    setBusy(false);
  };
  return (
    <div className="filefield">
      <input placeholder={`${label} URL`} value={value} onChange={(e) => onChange(e.target.value)} />
      <input type="file" accept={accept} onChange={upload} />
      {busy && <small>Uploading...</small>}
    </div>
  );
}

function QRBox({ l }) {
  const download = () => {
    const c = document.getElementById(`qr-${l._id}`);
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = `${l.qrCode}.png`;
    a.click();
  };
  return (
    <div className="qrbox">
      <QRCodeCanvas id={`qr-${l._id}`} value={l.qrCode} size={110} includeMargin />
      <small>{l.qrCode}</small>
      <button onClick={download}>Download QR</button>
    </div>
  );
}

export default function Admin() {
  const [routes, setRoutes] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [selRoute, setSelRoute] = useState('');
  const [stats, setStats] = useState(null);
  const [r, setR] = useState({ name: '', city: '', description: '' });
  const [l, setL] = useState(emptyL);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const loadRoutes = () => api.get('/routes').then((x) => setRoutes(x.data));
  const loadStats = () => api.get('/analytics/summary').then((x) => setStats(x.data));
  const loadLandmarks = (rid) => rid
    ? api.get(`/routes/${rid}`).then((x) => setLandmarks(x.data.landmarks))
    : setLandmarks([]);

  useEffect(() => { loadRoutes(); loadStats(); }, []);
  useEffect(() => { loadLandmarks(selRoute); }, [selRoute]);

  const addRoute = async (e) => {
    e.preventDefault();
    await api.post('/routes', r);
    setR({ name: '', city: '', description: '' });
    setMsg('Route added'); loadRoutes();
  };

  const saveLandmark = async (e) => {
    e.preventDefault();
    const timeline = l.timeline.split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
      const [year, ...rest] = s.split('|');
      return { year: year.trim(), event: rest.join('|').trim() };
    });
    const body = {
      route: l.route, name: l.name, lat: +l.lat, lng: +l.lng,
      description: { en: l.en, hi: l.hi },
      images: l.image ? [l.image] : [], modelUrl: l.modelUrl, videoUrl: l.videoUrl,
      audioUrl: { en: l.audioEn, hi: l.audioHi },
      timeline, character: { name: l.charName, quote: l.charQuote },
    };
    try {
      if (editId) await api.put(`/landmarks/${editId}`, body); else await api.post('/landmarks', body);
      setMsg(editId ? 'Landmark updated' : 'Landmark added');
      setL(emptyL); setEditId(null);
      if (selRoute) loadLandmarks(selRoute);
    } catch (err) { setMsg(err.response?.data?.message || 'Save failed'); }
  };

  const edit = (x) => { setL(toForm(x)); setEditId(x._id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const delLandmark = async (id) => { if (confirm('Delete landmark?')) { await api.delete(`/landmarks/${id}`); loadLandmarks(selRoute); } };
  const delRoute = async (id) => {
    if (confirm('Delete route and its landmarks?')) { await api.delete(`/routes/${id}`); if (selRoute === id) setSelRoute(''); loadRoutes(); }
  };
  const s = (k) => (e) => setL({ ...l, [k]: e.target.value });
  const f = (k) => (v) => setL({ ...l, [k]: v });

  return (
    <>
      <h2>Admin Dashboard</h2>
      {msg && <p className="ok">{msg}</p>}

      {stats && (
        <div className="grid">
          <div className="card"><h3>{stats.users}</h3>Registered users</div>
          <div className="card"><h3>{stats.arCount}</h3>AR / QR interactions</div>
          <div className="card"><h3>{stats.avgSession}s</h3>Avg session duration</div>
          <div className="card"><h3>{stats.avgRating || '–'} ★</h3>Satisfaction ({stats.ratingCount} ratings)</div>
          <div className="card"><b>Visitors per route</b>{stats.visitorsPerRoute.map((v) => <div key={v._id}>{v.name}: {v.visitors}</div>)}</div>
          <div className="card"><b>Most viewed landmarks</b>{stats.topLandmarks.map((v) => <div key={v._id}>{v.name}: {v.views}</div>)}</div>
        </div>
      )}

      <form className="card form" onSubmit={addRoute}>
        <h3>Add Route</h3>
        <input placeholder="Route name" required value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} />
        <input placeholder="City" required value={r.city} onChange={(e) => setR({ ...r, city: e.target.value })} />
        <textarea placeholder="Description" value={r.description} onChange={(e) => setR({ ...r, description: e.target.value })} />
        <button>Add route</button>
      </form>

      <form className="card form" onSubmit={saveLandmark}>
        <h3>{editId ? 'Edit Landmark' : 'Add Landmark + AR/Multimedia Content'}</h3>
        <select required value={l.route} onChange={s('route')}>
          <option value="">Select route</option>
          {routes.map((x) => <option key={x._id} value={x._id}>{x.name}</option>)}
        </select>
        <input placeholder="Name" required value={l.name} onChange={s('name')} />
        <input placeholder="Latitude" required value={l.lat} onChange={s('lat')} />
        <input placeholder="Longitude" required value={l.lng} onChange={s('lng')} />
        <textarea placeholder="Description (English)" required value={l.en} onChange={s('en')} />
        <textarea placeholder="Description (Hindi)" value={l.hi} onChange={s('hi')} />
        <FileField label="Image" accept="image/*" value={l.image} onChange={f('image')} />
        <FileField label="3D model (.glb)" accept=".glb,.gltf" value={l.modelUrl} onChange={f('modelUrl')} />
        <FileField label="Video" accept="video/*" value={l.videoUrl} onChange={f('videoUrl')} />
        <FileField label="Audio (English)" accept="audio/*" value={l.audioEn} onChange={f('audioEn')} />
        <FileField label="Audio (Hindi)" accept="audio/*" value={l.audioHi} onChange={f('audioHi')} />
        <input placeholder="Timeline: 1638|Foundation; 1648|Completed" value={l.timeline} onChange={s('timeline')} />
        <input placeholder="Historical figure name" value={l.charName} onChange={s('charName')} />
        <input placeholder="Figure quote" value={l.charQuote} onChange={s('charQuote')} />
        <button>{editId ? 'Update landmark' : 'Add landmark'}</button>
        {editId && <button type="button" className="danger" onClick={() => { setEditId(null); setL(emptyL); }}>Cancel edit</button>}
      </form>

      <h3>Manage Routes and Landmarks</h3>
      {routes.map((x) => (
        <div key={x._id} className="card row">
          <span>{x.name} ({x.city})</span>
          <span>
            <button onClick={() => setSelRoute(selRoute === x._id ? '' : x._id)}>{selRoute === x._id ? 'Hide' : 'Landmarks'}</button>{' '}
            <button className="danger" onClick={() => delRoute(x._id)}>Delete</button>
          </span>
        </div>
      ))}

      {selRoute && landmarks.map((x) => (
        <div key={x._id} className="card row">
          <span>{x.order}. {x.name}</span>
          <QRBox l={x} />
          <span>
            <button onClick={() => edit(x)}>Edit</button>{' '}
            <button className="danger" onClick={() => delLandmark(x._id)}>Delete</button>
          </span>
        </div>
      ))}
    </>
  );
}
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ARMode() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [l, setL] = useState(null);
  const [mode, setMode] = useState(id ? 'ar' : 'qr');
  const [err, setErr] = useState('');
  const video = useRef(null);
  const start = useRef(Date.now());

  // Load landmark + track AR interaction
  useEffect(() => {
    if (!id) return setL(null);
    start.current = Date.now();
    api.get(`/landmarks/${id}`).then((r) => {
      setL(r.data);
      api.post(`/landmarks/${id}/visit`);
      api.post('/analytics/track', { sessionId: sessionStorage.getItem('sid') || 'anon', landmark: id, route: r.data.route, type: 'ar' }).catch(() => {});
    });
    return () => {
      api.post('/analytics/track', { sessionId: sessionStorage.getItem('sid') || 'anon', landmark: id, type: 'ar', duration: Math.round((Date.now() - start.current) / 1000) }).catch(() => {});
    };
  }, [id]);

  // AR mode: camera feed behind overlay
  useEffect(() => {
    if (mode !== 'ar' || !id) return;
    let stream;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => { stream = s; if (video.current) video.current.srcObject = s; })
      .catch(() => setErr('Camera access denied or unavailable'));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [mode, id]);

  // QR mode: scanner
  useEffect(() => {
    if (mode !== 'qr') return;
    const scanner = new Html5Qrcode('qr-reader');
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, async (text) => {
      try {
        const { data } = await api.get(`/landmarks/qr/${encodeURIComponent(text)}`);
        await scanner.stop();
        nav(`/ar/${data._id}`);
      } catch { setErr('QR code not recognized'); }
    }).catch(() => setErr('Camera access denied or unavailable'));
    return () => { scanner.isScanning && scanner.stop().catch(() => {}); };
  }, [mode, nav]);

  const lang = user.language;

  return (
    <div>
      <div className="row">
        <button onClick={() => setMode('qr')}>📷 Scan QR</button>
        {id && <button onClick={() => setMode('ar')}>🔍 AR View</button>}
      </div>
      {err && <p className="error">{err}</p>}

      {mode === 'qr' && <div id="qr-reader" style={{ width: '100%', maxWidth: 400, margin: '1rem auto' }} />}

      {mode === 'ar' && l && (
        <div className="ar-stage">
          <video ref={video} autoPlay playsInline muted className="ar-video" />
          <div className="ar-overlay">
            <h3>{l.name}</h3>
            {l.modelUrl && <model-viewer src={l.modelUrl} alt="3D" ar ar-modes="webxr scene-viewer quick-look" camera-controls auto-rotate style={{ width: '100%', height: 220, background: 'transparent' }} />}
            <p>{l.description?.[lang] || l.description?.en}</p>
            {l.character?.name && <p className="char">🗣 <b>{l.character.name}:</b> “{l.character.quote}”</p>}
            <ul className="timeline">
              {l.timeline.map((t, i) => <li key={i} style={{ animationDelay: `${i * 0.5}s` }}><b>{t.year}</b> — {t.event}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
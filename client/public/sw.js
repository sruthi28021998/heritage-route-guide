const CACHE = 'heritage-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  const cacheable = e.request.method === 'GET' &&
    (/\/api\/(routes|landmarks)/.test(u.pathname) || ['image', 'audio'].includes(e.request.destination));
  if (!cacheable) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
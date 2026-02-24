/* WebScout Agent - Service Worker for offline/cache support */
const CACHE_NAME = 'webscout-v1';
const BASE = self.location.href.replace(/sw\.js.*$/, '');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([BASE, BASE + 'index.html', BASE + 'style.css', BASE + 'app.js']).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        if (res.ok && (e.request.url.endsWith('.css') || e.request.url.endsWith('.js') || e.request.url.endsWith('.html'))) {
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match(BASE + 'index.html')))
  );
});

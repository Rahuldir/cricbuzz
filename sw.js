/* ============================================================
   CRICBUZZ WEB - Service Worker
   Caches static assets for offline use.
   API calls always go to network.
   ============================================================ */

const CACHE_NAME = 'cricbuzz-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/api.js',
  '/i18n.js',
  '/scorecard.html',
  '/scorecard.js',
  '/manifest.json'
];

/* Install - pre-cache everything */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS).catch(function (err) {
        console.warn('[SW] Cache addAll failed:', err);
      });
    })
  );
  self.skipWaiting();
});

/* Activate - clear old caches */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

/* Fetch - cache-first for statics, network for API */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  /* Never cache API calls */
  if (url.hostname.indexOf('bigballs') >= 0 ||
      url.hostname.indexOf('api.') >= 0 ||
      url.pathname.indexOf('/api') === 0) {
    return;
  }

  /* External scripts (cdn, fonts) - network first */
  if (url.origin !== location.origin) {
    return;
  }

  /* Same-origin static assets - cache first */
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;

      return fetch(e.request).then(function (res) {
        if (res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return res;
      }).catch(function () {
        /* Fallback to index for navigation requests */
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

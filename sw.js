/* ============================================================
   CRICBUZZ WEB - Service Worker
   ============================================================ */

const CACHE_NAME = 'cricbuzz-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/api.js',
  '/i18n.js',
  '/livestreams.js',
  '/streamedpk.js',
  '/scorecard.html',
  '/scorecard.js',
  '/manifest.json',
  'https://cdorgapi.b-cdn.net/widgets/score.js',
  'https://cdorgapi.b-cdn.net/widgets/vmatchlist.js',
  'https://cdorgapi.b-cdn.net/widgets/matchlist.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        STATIC_ASSETS.map(function (url) {
          return cache.add(url).catch(function () {
            console.warn('[SW] Failed to cache:', url);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  if (url.hostname.indexOf('bigballs') >= 0 ||
      url.hostname.indexOf('api.') >= 0 ||
      url.pathname.indexOf('/api') === 0) {
    return;
  }

  // Allow CricketData widget scripts to load normally
  if (url.hostname.indexOf('cdorgapi.b-cdn.net') >= 0) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request);
      })
    );
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

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
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

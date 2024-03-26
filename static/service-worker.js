self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('pwa-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/static/styles.css',
        '/static/favicon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

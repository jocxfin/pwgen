self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/static/styles.css',
        '/static/favicon.png',
        '/static/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open('pwa-cache').then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

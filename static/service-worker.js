const CACHE_NAME = 'pwgen-cache-v1';
const urlsToCache = [
  '/',
  '/static/styles.css',
  '/static/favicon.png',
  '/static/manifest.json'
];

// Asenna vaiheessa välimuistiin tärkeät resurssit
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivointivaiheessa, hallitse vanhoja välimuisteja
self.addEventListener('activate', (event) => {
  // Aktivointilogiikka
});

// Hae pyynnöt ja yritä palauttaa välimuistista, muuten tee verkosta
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Välimuistista löytyi, palauta se
        if (response) {
          return response;
        }
        // Ei löytynyt välimuistista, hae verkosta
        return fetch(event.request);
      })
  );
});

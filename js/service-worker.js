// Code by Kanwar Adnan

const CACHE_NAME = 'results-cache-v19';

// Add the URLs of external scripts to be cached
const externalScriptUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js',
  'https://cdn.plot.ly/plotly-latest.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/css.css',
        '/js/js.js',
        ...externalScriptUrls,
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch here:');

  event.respondWith(
    caches.match(event.request).then(async (response) => {
      try {
        if (response) {
          console.log('Response from cache:', event.request.url);
          return response;
        }

        if (event.request.url.includes('/api_last-1-j0851899/')) {
          const networkResponse = await fetch(event.request);
          const responseClone = networkResponse.clone();
          const cacheOptions = {
            headers: { 'Cache-Control': 'no-store' },
          };
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, new Response(responseClone.body, cacheOptions));

          return networkResponse;
        }

        const networkResponse = await fetch(event.request);
        const responseClone = networkResponse.clone();
        const cacheExpiration = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
        const cacheOptions = {
          headers: { 'Cache-Control': `max-age=${cacheExpiration}` },
        };
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, new Response(responseClone.body, cacheOptions));

        return networkResponse;
      } catch (error) {
        console.error('Fetch error:', error);

        if (response) {
          console.log('Returning cached response:', event.request.url);
          return response;
        }

        return new Response('You are offline. Please check your internet connection.');
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

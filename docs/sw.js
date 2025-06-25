const CACHE_NAME = '16mins-v3';
const urlsToCache = [
  '/16mins/',
  '/16mins/index.html',
  '/16mins/assets/index-CoPxxsmA.js',
  '/16mins/assets/index-m623uHXE.css',
  '/16mins/manifest.json',
  '/16mins/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('SW: Installing service worker, cache name:', CACHE_NAME);
  console.log('SW: URLs to cache:', urlsToCache);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW: All URLs cached successfully');
      })
      .catch(error => {
        console.error('SW: Cache install failed:', error);
        // Let's try to cache each URL individually to see which ones fail
        return caches.open(CACHE_NAME).then(cache => {
          return Promise.allSettled(
            urlsToCache.map(url => {
              return cache.add(url).then(() => {
                console.log('SW: Successfully cached:', url);
              }).catch(err => {
                console.error('SW: Failed to cache:', url, err);
              });
            })
          );
        });
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  console.log('SW: Fetch request for:', event.request.url, 'destination:', event.request.destination);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        } else {
          console.log('SW: Not in cache, fetching from network:', event.request.url);
          return fetch(event.request).then(networkResponse => {
            console.log('SW: Network fetch successful for:', event.request.url, 'status:', networkResponse.status);
            return networkResponse;
          }).catch(err => {
            console.error('SW: Network fetch failed for:', event.request.url, err);
            throw err;
          });
        }
      })
      .catch((error) => {
        console.error('SW: Fetch failed for:', event.request.url, error);
        // Fallback for offline functionality
        if (event.request.destination === 'document') {
          console.log('SW: Trying fallback to /16mins/ for document request');
          return caches.match('/16mins/');
        }
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for timer completion
self.addEventListener('sync', event => {
  if (event.tag === 'timer-complete') {
    event.waitUntil(
      self.registration.showNotification('16mins Focus Complete!', {
        body: 'Great job! You completed a 16-minute focus session.',
        icon: '/16mins/icon-512.svg',
        badge: '/16mins/icon-512.svg',
        vibrate: [200, 100, 200],
        tag: 'timer-complete'
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll().then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/16mins/');
    })
  );
});

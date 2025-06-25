const CACHE_NAME = '16mins-v1';
const urlsToCache = [
  '/16mins/docs',
  '/16mins/docs/index.html',
  '/16mins/docs/assets/index-CoPxxsmA.js',
  '/16mins/docs/assets/index-m623uHXE.css',
  '/16mins/docs/manifest.json',
  '/16mins/docs/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for offline functionality
        if (event.request.destination === 'document') {
          return caches.match('/16mins/');
        }
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

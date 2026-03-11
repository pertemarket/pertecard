// ====== SERVICE WORKER - TECARD PWA ======

const CACHE_NAME = 'tecard-v1';
const RUNTIME_CACHE = 'tecard-runtime-v1';
const API_CACHE = 'tecard-api-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/pwa.js',
  '/admin/index.html',
  '/admin/css/admin.css',
  '/admin/js/admin.js',
  '/admin/js/workshop.js',
  '/assets/images/logo-placeholder.svg'
];

// ====== INSTALL EVENT ======
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aperta');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Risorse in cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Errore install:', error);
      })
  );
});

// ====== ACTIVATE EVENT ======
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== API_CACHE) {
            console.log('[SW] Elimina cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// ====== FETCH EVENT ======
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora richieste non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora richieste a domini esterni (non PWA)
  if (url.origin !== location.origin) {
    return;
  }

  // STRATEGIE DI CACHE

  // 1. API calls - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // 2. Assets (CSS, JS, immagini) - Cache first
  if (isAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // 3. Pages (HTML) - Stale while revalidate
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

// ====== STRATEGIE DI CACHE ======

// Cache First: Prova cache, poi network
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request)
    .then(response => {
      if (response) {
        console.log('[SW] Cache hit:', request.url);
        return response;
      }

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(cacheName).then(cache => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(error => {
          console.error('[SW] Fetch error:', error);
          return caches.match('/index.html');
        });
    });
}

// Network First: Prova network, poi cache
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then(response => {
      if (!response || response.status !== 200) {
        return response;
      }

      const responseClone = response.clone();
      caches.open(cacheName).then(cache => {
        cache.put(request, responseClone);
      });

      return response;
    })
    .catch(error => {
      console.log('[SW] Network error, usando cache:', request.url);
      return caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          
          // Se è una pagina e non c'è cache, mostra offline page
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          throw error;
        });
    });
}

// Stale While Revalidate: Usa cache ma ricarica in background
function staleWhileRevalidate(request, cacheName) {
  return caches.match(request)
    .then(cachedResponse => {
      const fetchPromise = fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(cacheName).then(cache => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(error => {
          console.error('[SW] Fetch error:', error);
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    });
}

// ====== UTILITY ======

function isAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)$/i.test(pathname);
}

// ====== MESSAGE HANDLER ======
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CHECK_UPDATE') {
    console.log('[SW] Verifica aggiornamenti');
  }
});

// ====== BACKGROUND SYNC ======
self.addEventListener('sync', event => {
  console.log('[SW] Background Sync:', event.tag);

  if (event.tag === 'sync-points') {
    event.waitUntil(
      syncPoints()
        .then(() => {
          console.log('[SW] Sync points completato');
        })
        .catch(error => {
          console.error('[SW] Errore sync points:', error);
          throw error;
        })
    );
  }
});

async function syncPoints() {
  // Qui sincronizzerai i punti con il server
  console.log('[SW] Sincronizzazione punti in corso...');
  return Promise.resolve();
}

// ====== PUSH NOTIFICATIONS ======
self.addEventListener('push', event => {
  console.log('[SW] Push notification ricevuta');

  const options = {
    body: event.data ? event.data.text() : 'Notifica da Te Card',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'tecard-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Te Card', options)
  );
});

// ====== NOTIFICATION CLICK ======
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification cliccata');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

console.log('[SW] Service Worker caricato');

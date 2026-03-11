// ====== PWA SERVICE WORKER ======

// Costanti
const CACHE_NAME = 'tecard-v1';
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

// ====== REGISTRAZIONE SERVICE WORKER ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registrato:', registration);
        
        // Controlla aggiornamenti ogni ora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch(error => {
        console.error('❌ Errore Service Worker:', error);
      });
  });
}

// ====== INSTALLAZIONE APP ======
let deferredPrompt = null;
const installButton = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostra bottone installa se esiste
  if (installButton) {
    installButton.style.display = 'block';
  }
  
  console.log('📦 App pronta per essere installata');
});

// Gestisci click bottone installa (se aggiunto in HTML)
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    }
  });
}

window.addEventListener('appinstalled', () => {
  console.log('🎉 App installata!');
  deferredPrompt = null;
});

// ====== NOTIFICATION PERMISSION ======
function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      console.log('✅ Notifiche già abilitate');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Notifiche abilitate');
          sendTestNotification();
        }
      });
    }
  }
}

function sendTestNotification() {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Te Card', {
        body: 'Benvenuto! App installata con successo',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/icon-72x72.png',
        tag: 'welcome',
        requireInteraction: false
      });
    });
  }
}

// ====== SCREEN WAKE LOCK ======
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      const wakeLock = await navigator.wakeLock.request('screen');
      console.log('✅ Screen Wake Lock attivo');
      
      // Rilascia quando hidden
      document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
          wakeLock.release();
        } else {
          try {
            await navigator.wakeLock.request('screen');
          } catch (err) {
            console.log('Errore re-acquire wake lock:', err);
          }
        }
      });
    }
  } catch (err) {
    console.log('Wake Lock non disponibile:', err);
  }
}

// ====== SCREEN BRIGHTNESS ======
async function setScreenBrightness(level) {
  try {
    if ('brightness' in navigator) {
      await navigator.brightness.request();
      console.log('✅ Brightness a:', level);
    }
  } catch (error) {
    console.log('Brightness control non disponibile');
  }
}

// ====== DEVICE ORIENTATION ======
async function lockOrientation(orientation) {
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock(orientation);
      console.log('✅ Orientamento bloccato:', orientation);
    }
  } catch (error) {
    console.log('Orientamento lock non disponibile');
  }
}

// ====== ONLINE/OFFLINE STATUS ======
window.addEventListener('online', () => {
  console.log('🟢 Online');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('🔴 Offline');
  document.body.classList.add('offline');
});

// Controlla stato iniziale
if (!navigator.onLine) {
  document.body.classList.add('offline');
}

// ====== LOCAL STORAGE MANAGER ======
class StorageManager {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Errore Storage:', error);
    }
  }

  static get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Errore Storage:', error);
      return null;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Errore Storage:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Errore Storage:', error);
    }
  }
}

// ====== INDEXED DB PER DATI OFFLINE ======
let db;

function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TecardDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      console.log('✅ IndexedDB inizializzato');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains('users')) {
        database.createObjectStore('users', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('points')) {
        database.createObjectStore('points', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'url' });
      }
    };
  });
}

// Inizializza IndexedDB quando pronto
window.addEventListener('load', () => {
  initIndexedDB().catch(error => {
    console.log('IndexedDB non disponibile:', error);
  });
});

// ====== AUTO SYNC ======
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    // Registra background sync
    registration.sync.register('sync-points').catch(error => {
      console.log('Background Sync non disponibile:', error);
    });
  });
}

// ====== CHECK UPDATE ======
function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'CHECK_UPDATE'
    });
  }
}

// Controlla aggiornamenti ogni 30 minuti
setInterval(checkForUpdates, 30 * 60 * 1000);

// ====== EXPORTS ======
window.PWAManager = {
  requestNotificationPermission,
  requestWakeLock,
  setScreenBrightness,
  lockOrientation,
  StorageManager,
  checkForUpdates
};

console.log('🚀 PWA Manager caricato');

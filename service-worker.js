const CACHE_NAME = 'tut-auth-cache-v2';
const urlsToCache = [
    '/',
    'index.html',
    'logo.png',
    'manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Orbitron:wght@500;700&display=swap',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js',
    'https://assets1.lottiefiles.com/packages/lf20_6wutsrox.json',
    // Cache the background images
    'morning.jpg', // Morning
    'afternoon.jpg', // Afternoon
    'evening.jpg', // Evening
    'night.jpg'  // Night
];

// Install event: Caches the necessary files on first visit.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache assets during install:', error);
            })
    );
});

// Fetch event: Serves cached content if available.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                
                // Otherwise, fetch from the network
                return fetch(event.request).catch(() => {
                    // Provide a fallback response for key resources if offline
                    if (event.request.url.includes('index.html')) {
                        return caches.match('index.html');
                    }
                });
            })
    );
});

// Activate event: Cleans up old caches to save space.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

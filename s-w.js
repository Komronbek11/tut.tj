const CACHE_NAME = 'tut-website-cache-v4';
const urlsToCache = [
    // --- HTML Pages ---
    '/',
        'home.html',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.1932320531314!2d68.75588737591917!3d38.52931367180507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d056a07a8161%3A0xa5989c5a7f5e8dca!2z0JTQvtC90LjRiNCz0L7Ss9C4INCi0LXRhdC90L7Qu9C-0LPQuNC4INCi0L7St9C40LrQuNGB0YLQvtC9!5e0!3m2!1sru!2s!4v1755559056833!5m2!1sru!2s',
        'manifest.json',
    'index.html',
    'jadvalidarsi.html',
    'fakultet.html',
    'teachers_tut.html',
    'app.html',
    'http://asu.tut.tj/?option=login',
    'notifications.html',
    'view.html',
    'imtihon.html',
    'zametki.html',
    'contact.html',
    'profile.html',
    'chatlist.html',
    'chat.html',
    'message-icon2.jpg',
    'message-icon.jpg',

    // --- Styles & Scripts ---
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.13.10/dist/cdn.min.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',

    // --- Images & Icons ---
    'logo.png',
    'logo1.jpg',
    'logo2.jpg',
    'logo3.jpg',
    'TUT.jpg',
    'teacher.png',
    'time-management.png',
    'books.png',
    'testing.png',
    'information.png',
    'workplace.png',
    'exam.png',
    'diary.png',
    'studying.png',
    'time.png',
    'tajikistan.png',
    'russia.png'
];

// Install event: open cache and add all specified URLs.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: respond with cached resource if available, otherwise fetch from network.
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response from cache
                if (response) {
                    return response;
                }

                // Not in cache - fetch from network
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                           // For third-party assets (like CDNs), the type will be 'opaque', which is fine.
                           // We just don't want to cache errors.
                           if(networkResponse.status !== 0 && networkResponse.type !== 'opaque') {
                               return networkResponse;
                           }
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
            .catch(() => {
                // If both cache and network fail, we can optionally return a fallback page.
                // For now, it will just result in a standard browser error.
            })
    );
});

// Activate event: clean up old caches.
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



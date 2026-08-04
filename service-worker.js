const CACHE_NAME = 'emran-site-pwa-v1';

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/curriculum_vitae.html',
    '/section_details.html',
    '/page_details.html',
    '/404.html',
    '/manifest.webmanifest',

    '/assets/css/style.css',

    '/assets/js/site-core.js',
    '/assets/js/site-util.js',
    '/assets/js/site-common.js',
    '/assets/js/site-loader.js',
    '/assets/js/site-index.js',
    '/assets/js/site-section.js',
    '/assets/js/site-cv.js',
    '/assets/js/site-page.js',
    '/assets/js/scripts.js',

    '/assets/img/pwa/icon-192.png',
    '/assets/img/pwa/icon-512.png',
    '/assets/img/pwa/icon-maskable-512.png',
    '/assets/img/pwa/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/404.html');
                        }

                        return new Response('', {
                            status: 408,
                            statusText: 'Offline'
                        });
                    });
            })
    );
});
const CACHE_NAME = 'my-app-cache-v82';
const OFFLINE_URL = '/offline.html';

// نصب اولیه (کش کردن صفحات پایه)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
                cache.addAll([
                    OFFLINE_URL,
                    '/index.html',
                    '/favicon.ico',
                    '/logo192.png',
                    '/logo512.png',
                    '/manifest.json',
                    '/splashLogo.png'

                ])
            /*cache.addAll([OFFLINE_URL, '/index.html','/logo192.png','/logo512.png','/splashLogo.png','/manifest.json'])*/
        )
    );
    self.skipWaiting();
});

// حذف کش‌های قدیمی
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// هندل کردن fetch
self.addEventListener('fetch', event => {
    const request = event.request;
    const accept = request.headers.get('accept') || '';
    const isAPIRequest = request.url.includes('/api') || request.url.includes('/messagehub');

    if (isAPIRequest) return;

    event.respondWith(
        fetch(request)
            .then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, response.clone());
                    return response;
                });
            })
            .catch(async () => {
                const cached = await caches.match(request);
                if (cached) return cached;

                // تشخیص درخواست صفحه HTML با accept
                if (accept.includes('text/html')) {
                    const indexCached = await caches.match('/index.html');
                    return indexCached || caches.match(OFFLINE_URL);
                }

                return new Response(null, { status: 503 });
            })
    );
});

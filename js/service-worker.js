const CACHE_NAME = "pratyaksh-vault-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./dashboard.html",
    "./css/style.css",
    "./css/dashboard.css",
    "./js/install.js",
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

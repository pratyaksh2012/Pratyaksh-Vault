const CACHE_NAME = "pratyaksh-vault-v1";

const urls = [
"/",
"/index.html",
"/dashboard.html",
"/css/style.css",
"/css/dashboard.css",
"/js/install.js",
"/icons/icon-192.png",
"/icons/icon-512.png"
];

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>cache.addAll(urls))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request)

.then(response=>response || fetch(e.request))

);

});

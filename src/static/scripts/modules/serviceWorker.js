const cacheName = "AutoMRP";

const staticResources = [
    "/",
    "/index.html",
    "/static/assets/icons/favicon.ico",
    "/static/assets/styles/bootstrap.min.css",
    "/static/assets/styles/main.css",
    "/static/assets/scripts/main.js",
    "/static/assets/scripts/modules/calculatorStore.js",
    "/static/assets/scripts/modules/exampleComponents.js",
    "/static/assets/scripts/modules/MpsCalculator.js",
    "/static/assets/scripts/modules/mpsTables.js",
    "/static/assets/scripts/modules/MrpCalculator.js",
    "/static/assets/scripts/modules/mrpTables.js",
    "/static/assets/scripts/modules/utils.js",
];

// Start the service worker and cache the app's content
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(staticResources);
        })
    );
    self.skipWaiting();
});

// Serve the cached content when offline
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

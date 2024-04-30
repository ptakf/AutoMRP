const cacheName = "AutoMRP";

const staticResources = [
    "/",
    "/index.html",
    "/static/assets/icons/favicon.ico",
    "/static/styles/bootstrap.min.css",
    "/static/styles/main.css",
    "/static/scripts/main.js",
    "/static/scripts/modules/calculatorStore.js",
    "/static/scripts/modules/exampleComponents.js",
    "/static/scripts/modules/MpsCalculator.js",
    "/static/scripts/modules/mpsTables.js",
    "/static/scripts/modules/MrpCalculator.js",
    "/static/scripts/modules/mrpTables.js",
    "/static/scripts/modules/utils.js",
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

const CACHE_NAME = "my-hms-shop-cache-v1";
const urlsToCache = [
  "./",
  "./index.html", 
  "./admin.js",
  "./app.js",
  "./bill.html", 
  "./dailyReport.html",
  "./indexedDb.js", 
  "./manifest.json",
  "./medi.html",
  "./medicalSearch.html",
  "./navbar.css",
  "./oldPatient.html",
  "./oldPatient.js",
  "./printable-bill.js",
  "./refund.html",
  "./refund.js",
  "./search.html",
  "./style.css",
  "./logo3.png",
  "./logo2.png",
  "./logo.jpg",
  "./logo-512.png",
  "./logo-128.png",
  "./logo-256.png",
  
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");

      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

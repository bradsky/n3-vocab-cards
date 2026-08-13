const CACHE_NAME = "n3-vocab-list-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "../daily/daily-cards.json",
  "../daily/day-1.json",
  "../daily/day-2.json",
  "../daily/day-3.json",
  "../daily/day-4.json",
  "../daily/day-5.json",
  "../daily/day-6.json",
  "../daily/day-7.json",
  "../daily/day-8.json",
  "../daily/day-9.json",
  "../daily/day-10.json",
  "../daily/day-11.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }))
  );
});
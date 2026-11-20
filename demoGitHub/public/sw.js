/* Wayco PWA: caché mínimo, limitado al directorio de la demo.
   No almacena respuestas de API ni datos personales. */
const CACHE_NAME = "wayco-pwa-shell-v1";
const APP_SCOPE = self.registration.scope;
const HOME = new URL("./", APP_SCOPE).href;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try { await cache.add(HOME); } catch (error) { console.warn("Wayco: shell no disponible", error); }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("wayco-pwa-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(APP_SCOPE)) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(HOME)) || Response.error();
      }
    })());
  }
});

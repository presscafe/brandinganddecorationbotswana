/* Branding & Decoration Botswana — offline-first PWA (v3 — 12 SEO pages)
   Strategy: app shell cache-first, data stale-while-revalidate, admin + ERP cached.
   Free, no backend. IndexedDB holds CMS/ERP data; SW serves the shell offline.
   Bump CACHE_VERSION whenever shell or core data changes.
*/
const CACHE_VERSION = "bdb-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./admin.html",
  "./privacy.html",
  "./terms.html",
  "./404.html",
  "./assets/styles.css",
  "./assets/admin.css",
  "./assets/app.js",
  "./assets/admin.js",
  "./assets/db.js",
  "./data/catalogue.json",
  "./data/suppliers.json",
  "./data/vendors.json",
  "./manifest.webmanifest",
  "./seo/embroidered-workwear-botswana.html",
  "./seo/ppe-supplier-gaborone.html",
  "./seo/corporate-gifts-botswana.html",
  "./seo/jwaneng-mining-workwear.html",
  "./seo/bob-compliance-garments.html",
  "./seo/local-content-tender-botswana.html",
  "./seo/corporate-clothing-gaborone.html",
  "./seo/branded-headwear-botswana.html",
  "./seo/display-event-gaborone.html",
  "./seo/francistown-workwear.html",
  "./seo/maun-workwear.html",
  "./seo/school-uniforms-botswana.html",
  "./ethical-charter.html",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // For data/*.json: stale-while-revalidate (serve cache immediately, update in background)
  if (url.pathname.includes("/data/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((c) => c.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }

  // App shell: cache-first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          // cache successful GETs
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached || caches.match("./404.html") || caches.match("./index.html"));
      return cached || network;
    })
  );
});

// Background sync + periodic sync stubs (free — works when browser supports it)
self.addEventListener("sync", (event) => {
  if (event.tag === "bdb-sync-queue") {
    event.waitUntil(
      // Clients will flush IndexedDB syncQueue when online; SW is just a trigger
      self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
        clients.forEach((c) => c.postMessage({ type: "BDB_FLUSH_QUEUE" }));
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

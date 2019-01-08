importScripts("precache-manifest.9333260e34f14dfc6a348b3df4f0ec4d.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (!workbox) {
  console.error(`Boo! Workbox didn't load 😬`); 
}

// This will be auto filled in the build step
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg)$/, 
  workbox.strategies.cacheFirst(
    { 
      "cacheName":"images", 
      plugins: [new workbox.expiration.Plugin({"maxEntries":10,"purgeOnQuotaError":false})] 
    }),
  'GET');

addEventListener('message', event => {
    const replyPort = event.ports[0]
    const message = event.data
    if (replyPort && message && message.type === 'skip-waiting') {
      event.waitUntil(
        self.skipWaiting().then(
          () => replyPort.postMessage({ error: null }),
          error => replyPort.postMessage({ error })
        )
      )
    }
  })

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (!workbox) {
  console.error(`Boo! Workbox didn't load 😬`);
}

// This will be auto filled in the build step
workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
  new RegExp('\/(page\/\d)?'),
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  new RegExp('/index.json'),
  new workbox.strategies.StaleWhileRevalidate(),
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg)$/,
  workbox.strategies.cacheFirst(
    {
      "cacheName": "images",
      plugins: [new workbox.expiration.Plugin({ "maxEntries": 10, "purgeOnQuotaError": false })]
    }),
  'GET');
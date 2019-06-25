importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (!workbox) {
  console.error(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('\/(page\/\d)?'),
  new workbox.strategies.NetworkFirst()
);


// This will be auto filled in the build step
workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg)$/,
  workbox.strategies.cacheFirst(
    {
      "cacheName": "images",
      plugins: [new workbox.expiration.Plugin({ "maxEntries": 10, "purgeOnQuotaError": false })]
    }),
  'GET');

addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  console.log('Received message');
  if (replyPort && message && message.type === 'skip-waiting') {
    console.log('Received skip-waiting event')
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (!workbox) {
  console.error(`Boo! Workbox didn't load 😬`); 
  return;
}

// This will be auto filled in the build step
workbox.precaching.precacheAndRoute([]);

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
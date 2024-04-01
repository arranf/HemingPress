// Entry point for CSS
import './styles/theme.scss';

import("./js/sidebar");
import("./js/search-box");

import yamz from "yet-another-medium-zoom";

// Use native lazy image loading if possible, else use lazysizes.

const images = document.querySelectorAll("img.lazyload");
if ("loading" in HTMLImageElement.prototype) {
  console.debug("Native lazy loading enabled");

  // Lazysizes won't load our images in for us so we need to set the them here.
  const sources = document.querySelectorAll("source");
  sources.forEach((source) => {
    source.srcset = source.dataset.srcset;
  });

  images.forEach((img) => {
    img.srcset = img.dataset.srcset;
  });

} else {
  console.debug("Native lazy loading not enabled");

  // Dynamically import the LazySizes library.
  // Initiate LazySizes (reads data-srcset, data-src, and class=lazyload).
  import("lazysizes").then((lazySizes) => {
    lazySizes.init();
  });
}
yamz.bind([...images])


if ("serviceWorker" in window.navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

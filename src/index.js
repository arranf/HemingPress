// Entry point for CSS
import './styles/theme.scss';

import { register } from 'register-service-worker'
import SWUpdateEvent from './js/SWUpdateEvent'

import('./js/sidebar')
import('./js/SearchBox');

// Use native lazy image loading if possible, else use lazysizes.
if ('loading' in HTMLImageElement.prototype) {
    console.debug('Native lazy loading enabled')

    // Lazysizes won't load our images in for us, so we set them here.
    const sources = document.querySelectorAll('source');
    sources.forEach(source => {
        source.srcset = source.dataset.srcset;
    });

    const images = document.querySelectorAll("img.lazyload");
    images.forEach(img => {
        img.srcset = img.dataset.srcset;
    });
} else {
    console.debug('Native lazy loading not enabled')

    // Dynamically import the LazySizes library.
    // Initiate LazySizes (reads data-srcset, data-src, and class=lazyload).
    import('lazysizes')
        .then(lazySizes => lazySizes.init());
}

if ('serviceWorker' in window.navigator) {
    registerSW();
}

function registerSW() {
    register('/sw.js', {
        ready() {
            console.debug('Service worker is active.')
        },
        registered(registration) {
            console.debug('Service worker has been registered.')
        },
        cached(registration) {
            console.debug('Content has been cached for offline use.')
        },
        updatefound(registration) {
            console.debug('New content is downloading.')
        },
        updated(registration) {
            const updateEvent = new SWUpdateEvent(registration);
            import('./js/PopUp')
                .then(module => {
                    const renderPopUp = module.default;
                    renderPopUp(updateEvent);
                })
            console.debug('New content is available; please refresh.')
        },
        offline() {
            console.debug('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.warn('Error during service worker registration:', error)
        }
    })
}
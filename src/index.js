// Entry point for CSS
import './styles/theme.styl';

import { register } from 'register-service-worker'
import SWUpdateEvent from './js/SWUpdateEvent'

import Vue from 'vue'
import PopUp from './js/PopUp.vue';
import SearchBox from './js/SearchBox.vue';

// Entry point for lazysizes
import lazysizes from "lazysizes";

if ('serviceWorker' in window.navigator) {
    registerSW();
}

showSearch();

function registerSW() {
    console.log('Register SW fired');
    register('/sw.js', {
        ready () {
            console.log('Service worker is active.')   
        },
        registered (registration) {
            console.log('Service worker has been registered.')
        },
        cached (registration) {
            console.log('Content has been cached for offline use.')
        },
        updatefound (registration) {
            console.log('New content is downloading.')
        },
        updated (registration) {
            const updateEvent = new SWUpdateEvent(registration);
            new Vue({
                el: '#popup',
                render: h => h(
                  PopUp, 
                  {
                    props: {
                      updateEvent
                    }
                  })
              });
            console.log('New content is available; please refresh.')
        },
        offline () {
            console.log('Change for Service Worker')
            console.log('No internet connection found. App is running in offline mode.')
        },
        error (error) {
            console.error('Error during service worker registration:', error)
        }
    })
}

function showSearch() {
    new Vue({
        el: '#searchbox-vue',
        render: h => h(SearchBox)
    })
}
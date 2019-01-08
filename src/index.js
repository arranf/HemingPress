// Entry point for CSS
import './styles/theme.styl';

import Vue from 'vue'
// import Lunr from 'lunr'
import SearchBox from './js/SearchBox.vue';

function showSearch() {
    new Vue({
        el: '#searchbox-vue',
        render: h => h(SearchBox)
    })
}

window.addEventListener ? 
    window.addEventListener("load",showSearch, false) 
    : 
    window.attachEvent && window.attachEvent("onload",showSearch);
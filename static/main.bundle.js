!function(e){function n(n){for(var o,i,u=n[0],a=n[1],c=n[2],f=0,d=[];f<u.length;f++)i=u[f],r[i]&&d.push(r[i][0]),r[i]=0;for(o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o]);for(l&&l(n);d.length;)d.shift()();return s.push.apply(s,c||[]),t()}function t(){for(var e,n=0;n<s.length;n++){for(var t=s[n],o=!0,u=1;u<t.length;u++){var a=t[u];0!==r[a]&&(o=!1)}o&&(s.splice(n--,1),e=i(i.s=t[0]))}return e}var o={},r={0:0},s=[];function i(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=o,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)i.d(t,o,function(n){return e[n]}.bind(null,o));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="";var u=window.webpackJsonp=window.webpackJsonp||[],a=u.push.bind(u);u.push=n,u=u.slice();for(var c=0;c<u.length;c++)n(u[c]);var l=a;s.push([13,1]),t()}([function(e,n,t){},function(e,n,t){},,,,,,function(e,n,t){},function(e,n,t){"use strict";var o=t(0);t.n(o).a},function(e,n,t){"use strict";var o=t(1);t.n(o).a},,,,function(e,n,t){"use strict";t.r(n),t(7);var o=t(4),r=t(6);function s(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var i=function(){function e(n){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),Object.defineProperty(this,"registration",{value:n,configurable:!0,writable:!0})}var n,t;return n=e,(t=[{key:"update",value:function(){return this.registration.update()}},{key:"skipWaiting",value:function(){var e=this.registration.waiting;return e?(console.log("[vuepress:sw] Doing worker.skipWaiting()."),new Promise(function(n,t){var o=new MessageChannel;o.port1.onmessage=function(e){console.log("[vuepress:sw] Done worker.skipWaiting()."),e.data.error?t(e.data.error):n(e.data)},e.postMessage({type:"skip-waiting"},[o.port2])})):Promise.resolve()}}])&&s(n.prototype,t),e}(),u=t(5),a=t.n(u),c={name:"SearchBox",data:function(){return{query:"",focused:!1,focusIndex:0,lunrIndex:null,documents:null,loading:!0}},computed:{ready:function(){return this.lunrIndex&&this.documents},getCurrentHostname:function(){return window.location.protocol+"//"+window.location.host},showSuggestions:function(){return this.focused&&this.suggestions&&this.suggestions.length},suggestions:function(){var e=this.query.trim().toLowerCase();if(e){var n=this.documents;return this.lunrIndex.search(e).map(function(e){return n.find(function(n){return n.href===e.ref})}).filter(function(e,n){return n<5})}}},methods:{onUp:function(){this.showSuggestions&&(0<this.focusIndex?this.focusIndex--:this.focusIndex=this.suggestions.length-1)},onDown:function(){this.showSuggestions&&(this.focusIndex<this.suggestions.length-1?this.focusIndex++:this.focusIndex=0)},go:function(e){this.showSuggestions&&(window.location.href=this.getCurrentHostname+this.suggestions[e].href,this.query="",this.focusIndex=0)},focus:function(e){this.focusIndex=e},unfocus:function(){this.focusIndex=-1}},mounted:function(){var e=new XMLHttpRequest,n=this.getCurrentHostname+"/js/lunr/index.json";e.open("GET",n,!0),e.onload=function(){if(200<=e.status&&e.status<400){this.documents=JSON.parse(e.responseText);var n=this.documents;try{this.lunrIndex=a()(function(){this.field("title",{boost:5}),this.field("tags",{boost:2}),this.field("content"),this.ref("href");for(var e=0;e<n.length;e++)this.add(n[e])})}catch(e){this.loading=!1,console.error("Error accessing lunr")}}else this.loading=!1,console.error("Unable to fetch Lunr data.")}.bind(this),e.onerror=function(){console.error("There was a connection error of some sort")},e.send()}},l=(t(8),t(2)),f=Object(l.a)(c,function(){var e=this,n=e.$createElement,t=e._self._c||n;return e.ready?t("div",{staticClass:"search-box"},[t("input",{class:{focused:e.focused},attrs:{"aria-label":"Search",autocomplete:"off",spellcheck:"false"},domProps:{value:e.query},on:{input:function(n){e.query=n.target.value},focus:function(n){e.focused=!0},blur:function(n){e.focused=!1},keyup:[function(n){if(!("button"in n)&&e._k(n.keyCode,"enter",13,n.key,"Enter"))return null;e.go(e.focusIndex)},function(n){return"button"in n||!e._k(n.keyCode,"up",38,n.key,["Up","ArrowUp"])?e.onUp(n):null},function(n){return"button"in n||!e._k(n.keyCode,"down",40,n.key,["Down","ArrowDown"])?e.onDown(n):null}]}}),e._v(" "),e.showSuggestions?t("ul",{staticClass:"suggestions",on:{mouseleave:e.unfocus}},e._l(e.suggestions,function(n,o){return t("li",{key:n.href,staticClass:"suggestion",class:{focused:o===e.focusIndex},on:{mousedown:function(n){e.go(o)},mouseenter:function(n){e.focus(o)}}},[t("a",{attrs:{href:n.href},on:{click:function(e){e.preventDefault()}}},[t("span",{staticClass:"page-title"},[e._v(e._s(n.title||n.href))])])])}),0):e._e()]):e.loading?t("div",[t("div",{staticClass:"sp sp-hydrogen no-js-hidden"})]):e._e()},[],!1,null,"337fab0f",null);f.options.__file="SearchBox.vue";var d=f.exports,p={props:{updateEvent:{type:Object,default:null}},computed:{enabled:function(){return Boolean(this.updateEvent)},message:function(){return"New content is available."},buttonText:function(){return"Refresh"}},methods:{reload:function(){this.updateEvent&&(this.updateEvent.skipWaiting().then(function(){location.reload(!0)}),this.updateEvent=null),location.reload(!0)}}},h=(t(9),Object(l.a)(p,function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("transition",{attrs:{name:"sw-update-popup"}},[e.enabled?t("div",{staticClass:"sw-update-popup",on:{click:e.reload}},[t("p",{on:{click:e.reload}},[e._v(e._s(e.message))]),e._v(" "),t("a",{on:{click:e.reload}},[e._v("\n      "+e._s(e.buttonText)+"\n    ")])]):e._e()])},[],!1,null,"7219ced4",null));h.options.__file="PopUp.vue";var g=h.exports;Object(r.a)("/sw.js",{ready:function(){console.log("Service worker is active.")},registered:function(e){console.log("Service worker has been registered.")},cached:function(e){console.log("Content has been cached for offline use.")},updatefound:function(e){console.log("New content is downloading.")},updated:function(e){new o.a({el:"#popup",render:function(n){return n(g,{props:{updateEvent:new i(e)}})}}),console.log("New content is available; please refresh.")},offline:function(){console.log("Change for Service Worker"),console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),new o.a({el:"#searchbox-vue",render:function(e){return e(d)}})}]);
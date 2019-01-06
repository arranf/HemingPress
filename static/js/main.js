var template = `
<div class="search-box">
  <input
    @input="query = $event.target.value"
    aria-label="Search"
    :value="query"
    :class="{ 'focused': focused }"
    autocomplete="off"
    spellcheck="false"
    @focus="focused = true"
    @blur="focused = false"
    @keyup.enter="go(focusIndex)"
    @keyup.up="onUp"
    @keyup.down="onDown"
  >
  <ul
    class="suggestions"
    v-if="showSuggestions"
    @mouseleave="unfocus"
  >
    <li
      class="suggestion"
      v-for="(s, i) in suggestions"
      :class="{ focused: i === focusIndex }"
      @mousedown="go(i)"
      @mouseenter="focus(i)"
    >
      <a :href="s.href" @click.prevent>
        <span class="page-title">{{ s.title || s.href }}</span>
      </a>
    </li>
  </ul>
</div>`
var searchBoxComponent = Vue.extend({
    template,
    data() {
        return {
            query: '',
            focused: false,
            focusIndex: 0,
            lunrIndex: null,
            documents: null
        }
    },
    computed: {
        getCurrentHostname() {
          return window.location.protocol + '//' + window.location.host
        },
        showSuggestions () {
            return (
              this.focused &&
              this.suggestions &&
              this.suggestions.length
            )
          },
          suggestions () {
            var query = this.query.trim().toLowerCase()
            if (!query) {
              return
            }
            // Find the item in our index corresponding to the lunr one to have more info
            // Lunr result:
            //  {ref: "/section/page1", score: 0.2725657778206127}
            // Our result:
            //  {title:"Page1", href:"/section/page1", ...}
            var documents = this.documents;
            var results = this.lunrIndex.search(query)
            return results.map((r) =>
              documents.find(p => p.href === r.ref)
            )
            // Take 5 suggestions
            .filter((i, index) => (index < 5));
          }
    },
    methods: {
        onUp () {
          if (this.showSuggestions) {
            if (this.focusIndex > 0) {
              this.focusIndex--
            } else {
              this.focusIndex = this.suggestions.length - 1
            }
          }
        },
        onDown () {
          if (this.showSuggestions) {
            if (this.focusIndex < this.suggestions.length - 1) {
              this.focusIndex++
            } else {
              this.focusIndex = 0
            }
          }
        },
        go (i) {
          if (!this.showSuggestions) {
            return
          }
          window.location.href = this.getCurrentHostname + this.suggestions[i].href
          this.query = ''
          this.focusIndex = 0
        },
        focus (i) {
          this.focusIndex = i
        },
        unfocus () {
          this.focusIndex = -1
        }      
      },
    mounted() {
      var request = new XMLHttpRequest();
      var url = this.getCurrentHostname + '/js/lunr/index.json';
      request.open('GET', url, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          this.documents = JSON.parse(request.responseText);

          const documents = this.documents 
          // Set up lunrjs by declaring the fields we use
          // Also provide their boost level for the ranking
          this.lunrIndex = lunr(function() {
              this.field("title", {
                  boost: 5
              });
              this.field("tags", {
                  boost: 2
              });
              this.field("content");

              // ref is the result item identifier (I chose the page URL)
              this.ref("href");

              for (var i = 0; i < documents.length; i++) {
                this.add(documents[i]);
              }
          });

          // Feed lunr with each file and let lunr actually index them
          
          console.log('Lunr ready!');
          } else {
          console.log('We reached our target server, but it returned an error');
        }
      }.bind(this);

      request.onerror = function() {
        console.log('There was a connection error of some sort');
      };

      request.send();
    }
  })

Vue.component('search-box', searchBoxComponent)

new Vue({
  el: '#searchbox-vue'
})

console.log('Searchbox registered')
<template>
  <div class="search-box" v-if="ready">
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
    />
    <ul class="suggestions" v-if="showSuggestions" @mouseleave="unfocus">
      <li
        class="suggestion"
        :key="s.href"
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
  </div>
  <div v-else-if="loading">
    <div class="sp sp-hydrogen no-js-hidden"></div>
  </div>
</template>

<script>
import lunr from "lunr";

const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

export default {
  name: "SearchBox",
  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0,
      lunrIndex: null,
      documents: null,
      loading: true
    };
  },
  computed: {
    ready() {
      return this.lunrIndex && this.documents;
    },
    getCurrentHostname() {
      return window.location.protocol + "//" + window.location.host;
    },
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },
    suggestions() {
      const query = this.query.trim().toLowerCase();
      if (!query) {
        return;
      }
      // Find the item in our index corresponding to the lunr one to have more info
      // Lunr result:
      //  {ref: '/section/page1', score: 0.2725657778206127}
      // Our result:
      //  {title:'Page1', href:'/section/page1', ...}
      const documents = this.documents;
      const results = this.lunrIndex.search(query);
      return (
        results
          .map(r => documents.find(p => p.href === r.ref))
          // Take 5 suggestions
          .filter((i, index) => index < 5)
      );
    }
  },

  mounted() {
    let request = new XMLHttpRequest();
    const url = this.getCurrentHostname + "/js/lunr/index.json";
    request.open("GET", url, true);
    request.onload = function() {
      if (request.status < 200 || request.status >= 400) {
        this.loading = false;
        console.error("Unable to fetch Lunr data.");
      }

      this.documents = JSON.parse(request.responseText);

      const documents = this.documents;
      // Set up lunrjs by declaring the fields we use
      // Also provide their boost level for the ranking
      try {
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

          // Feed lunr with each file and let lunr actually index them
          for (let i = 0; i < documents.length; i++) {
            this.add(documents[i]);
          }
        });
      } catch (e) {
        console.error("Error accessing lunr");
      } finally {
        this.loading = false;
      }
    }.bind(this);

    request.onerror = function() {
      console.error("There was a connection error of some sort");
      this.loading = false;
    }.bind(this);

    request.send();
  },
  methods: {
    onUp() {
      if (!this.showSuggestions) {
        return;
      }
      if (this.focusIndex > 0) {
        this.focusIndex--;
      } else {
        this.focusIndex = this.suggestions.length - 1;
      }
    },
    onDown() {
      if (!this.showSuggestions) {
        return;
      }
      if (this.focusIndex < this.suggestions.length - 1) {
        this.focusIndex++;
      } else {
        this.focusIndex = 0;
      }
    },
    go(i) {
      if (!this.showSuggestions) {
        return;
      }
      window.location.href = this.getCurrentHostname + this.suggestions[i].href;
      this.query = "";
      this.focusIndex = 0;
    },
    focus(i) {
      this.focusIndex = i;
    },
    unfocus() {
      this.focusIndex = -1;
    }
  }
};
</script>

<style lang='stylus' scoped>
@import '../styles/config.styl';

.search-box {
  display: inline-block;
  position: relative;
  margin-right: 1rem;

  input {
    cursor: text;
    width: 10rem;
    color: lighten($textColor, 25%);
    display: inline-block;
    border: 1px solid darken($borderColor, 10%);
    border-radius: 2rem;
    font-size: 0.9rem;
    line-height: 2rem;
    padding: 0 0.5rem 0 2rem;
    outline: none;
    transition: all 0.2s ease;
    background: #fff url('../styles/search.svg') 0.6rem 0.5rem no-repeat;
    background-size: 1rem;

    &:focus {
      cursor: auto;
      border-color: $accentColor;
    }
  }

  .suggestions {
    background: #fff;
    width: 20rem;
    position: absolute;
    top: 1.5rem;
    border: 1px solid darken($borderColor, 10%);
    border-radius: 6px;
    padding: 0.4rem;
    list-style-type: none;

    &.align-right {
      right: 0;
    }
  }

  .suggestion {
    line-height: 1.4;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;

    a {
      white-space: normal;
      color: lighten($textColor, 35%);

      .page-title {
        font-weight: 600;
      }

      .header {
        font-size: 0.9em;
        margin-left: 0.25em;
      }
    }

    &.focused {
      background-color: #f3f4f5;

      a {
        color: $accentColor;
      }
    }
  }
}

@media (max-width: $MQNarrow) {
  .search-box {
    input {
      cursor: pointer;
      width: 0;
      border-color: transparent;
      position: relative;

      &:focus {
        cursor: text;
        left: 0;
        width: 10rem;
      }
    }
  }
}

@media (max-width: $MQNarrow) and (min-width: $MQMobile) {
  .search-box {
    .suggestions {
      left: 0;
    }
  }
}

@media (max-width: $MQMobile) {
  .search-box {
    margin-right: 0;

    input {
      left: 1rem;
    }

    .suggestions {
      right: 0;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .search-box {
    .suggestions {
      width: calc(100vw - 4rem);
    }

    input:focus {
      width: 8rem;
    }
  }
}
</style>

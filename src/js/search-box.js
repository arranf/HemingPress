import { MeiliSearch } from "meilisearch";
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

const client = new MeiliSearch({
  host: "https://search.arranfrance.com", //TODO: Make this config
  apiKey: "9ced724c60b21d170a222c692cceb7716133e6e0eb100a6532c4ae4f00a89cc0", // This is okay to be public
});

const index = client.index("blog");

let state = {
  query: "",
  isFocused: false,
  focusIndex: 0,
  loading: true,
  suggestions: [],
};

function shouldShowSuggestions() {
  return state.isFocused && state.suggestions && state.suggestions.length;
}

const renderNewDom = (newSuggestions) => {
  // If we don't need to update the suggestions, use what's in state.
  if (!newSuggestions) {
    newSuggestions = state.suggestions;
  }

  const searchBoxSuggestions = document.getElementById(
    "search-box-suggestions"
  );

  // If no focus, hide
  if (!state.isFocused) {
    searchBoxSuggestions.classList.add("hidden");
    return;
  }

  const newDomNodes = suggestionsToDomNodes(newSuggestions);
  state.suggestions = newSuggestions;

  // Remove what's there
  let child;
  while ((child = searchBoxSuggestions.firstChild)) {
    child.remove();
  }

  for (let i = 0; i < newDomNodes.length; i++) {
    searchBoxSuggestions.appendChild(newDomNodes[i]);
  }

  if (newSuggestions.length === 0) {
    searchBoxSuggestions.classList.add("hidden");
  } else {
    searchBoxSuggestions.classList.remove("hidden");
  }
};

const suggestionsToDomNodes = (suggestions) => {
  const listElements = [];
  for (let i = 0; i < suggestions.length; i++) {
    const suggestion = suggestions[i];

    const li = document.createElement("li");
    li.classList.add("suggestion");

    if (i === state.focusIndex) {
      li.classList.add("focused");
    }

    li.addEventListener("mousedown", () => go(i));
    li.addEventListener("mouseenter", () => listFocus(i));

    const a = document.createElement("a");
    a.setAttribute("href", suggestion.permalink);
    a.onclick = (event) => event.preventDefault();

    const span = document.createElement("span");
    span.classList.add("page-title");

    const text = document.createTextNode(suggestion.title);

    span.appendChild(text);
    a.appendChild(span);
    li.appendChild(a);
    listElements.push(li);
  }
  return listElements;
};

const getSuggestions = async (input) => {
  const query = input.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const results = await index.search(query);

  return (
    results.hits
      // Take 5 suggestions
      .filter((i, index) => index < 5)
  );
};

// Suggestions Handlers

const listFocus = (i) => {
  state.focusIndex = i;
  renderNewDom();
};

const listUnfocus = (i) => {
  state.focusIndex = -1;
  renderNewDom();
};

// Box Event Handlers

const onInput = (event) => {
  state.query = event.target.value.trim();

  if (state.query === "") {
    state.isFocused = false;
  } else {
    state.isFocused = true;
  }

  getSuggestions(event.target.value).then((suggestions) =>
    renderNewDom(suggestions)
  );
};

const onBlur = () => {
  state.isFocused = false;
  const searchBox = document.getElementById("search-box");
  searchBox.classList.remove('show')
  
  const searchBoxIcon = document.getElementById("search-box-icon");
  searchBoxIcon.classList.remove('hidden');
};

const onFocus = () => {
  state.isFocused = true;
};

const keyHandler = (event) => {
  // Ignore IME composition: https://www.fxsitecompat.dev/en-CA/docs/2018/keydown-and-keyup-events-are-now-fired-during-ime-composition/
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  // https://keycode.info/
  // Up key
  if (event.keyCode === 38) {
    onUp();
  }

  // Down key
  if (event.keyCode === 40) {
    onDown();
  }

  // Enter
  if (event.keyCode === 13) {
    go(state.focusIndex);
  }
};

// Key Handle Functions
const onUp = () => {
  state.focusIndex = clamp(
    state.focusIndex - 1,
    0,
    state.suggestions.length - 1
  );
  renderNewDom();
};

const onDown = () => {
  state.focusIndex = clamp(
    state.focusIndex + 1,
    0,
    state.suggestions.length - 1
  );
  renderNewDom();
};

const go = (i) => {
  if (!shouldShowSuggestions()) {
    return;
  }

  window.location.href = state.suggestions[i].permalink;
  state.query = "";
  state.focusIndex = 0;
};

const setUpEventListeners = () => {
  // Search Box Listeners.
  const searchBox = document.getElementById("search-box");
  searchBox.oninput = onInput;
  searchBox.onfocus = onFocus;
  searchBox.onblur = onBlur;
  searchBox.addEventListener("keyup", keyHandler);


  const searchBoxIcon = document.getElementById("search-box-icon");
  searchBoxIcon.onclick = () => {
    searchBox.classList.add('show');
    searchBoxIcon.classList.add('hidden');
    searchBox.focus();
  }

  // Suggestions Listeners
  const searchBoxSuggestions = document.getElementById(
    "search-box-suggestions"
  );
  searchBoxSuggestions.addEventListener("mouseleave", listUnfocus);
};

// Setup event listeners
setUpEventListeners();

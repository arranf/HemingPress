import lunr from "lunr";
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

let state = {
    query: "",
    isFocused: false,
    focusIndex: 0,
    lunrIndex: null,
    documents: null,
    loading: true,
    suggestions: []
};

function shouldShowSuggestions() {
    return state.isFocused && state.suggestions && state.suggestions.length;
}

const currentHostName = window.location.protocol + "//" + window.location.host;

const renderNewDom = (newSuggestions) => {
    // If we don't need to update the suggestions, use what's in state.
    if (!newSuggestions) {
        newSuggestions = state.suggestions;
    }

    const searchBoxSuggestions = document.getElementById('search-box-suggestions');

    // If no focus, hide
    if (!state.isFocused) {
        searchBoxSuggestions.classList.add('hidden');
        return;
    }

    const newDomNodes = suggestionsToDomNodes(newSuggestions);
    state.suggestions = newSuggestions;

    // Remove what's there
    let child;
    while (child = searchBoxSuggestions.firstChild) {
        child.remove();
    }

    for (let i = 0; i < newDomNodes.length; i++) {
        searchBoxSuggestions.appendChild(newDomNodes[i]);
    }

    if (newSuggestions.length === 0) {
        searchBoxSuggestions.classList.add('hidden');
    } else {
        searchBoxSuggestions.classList.remove('hidden');
    }
}

const suggestionsToDomNodes = (suggestions) => {
    const listElements = [];
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];

        const li = document.createElement("li");
        li.classList.add("suggestion");

        if (i === state.focusIndex) {
            li.classList.add('focused');
        }

        li.addEventListener("mousedown", () => go(i));
        li.addEventListener("mouseenter", () => listFocus(i));

        const a = document.createElement("a");
        a.setAttribute("href", suggestion.href);
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
}

const getSuggestions = (input) => {
    const query = input.trim().toLowerCase();
    if (!query) {
        return [];
    }
    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result:
    //  {ref: '/section/page1', score: 0.2725657778206127}
    // Our result:
    //  {title:'Page1', href:'/section/page1', ...}
    const documents = state.documents;
    const results = state.lunrIndex.search(query);
    return (
        results
            .map(r => documents.find(p => p.href === r.ref))
            // Take 5 suggestions
            .filter((i, index) => index < 5)
    );
}

function setUpState() {
    let request = new XMLHttpRequest();
    const url = currentHostName + "/js/lunr/index.json";
    request.open("GET", url, true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status < 200 || request.status >= 400) {
                state.loading = false;
                console.error("Unable to fetch Lunr data.");
            }

            state.documents = JSON.parse(request.responseText);

            // Set up lunrjs by declaring the fields we use.
            // Here we also provide their boost level for the ranking.
            try {
                state.lunrIndex = lunr(function () {
                    this.field("title", {
                        boost: 5
                    });
                    this.field("tags", {
                        boost: 2
                    });
                    this.field("content");

                    // ref is the result item identifier (I chose the page URL)
                    this.ref("href");

                    // Feed lunr with each file and let lunr actually index them.
                    for (let i = 0; i < state.documents.length; i++) {
                        this.add(state.documents[i]);
                    }
                });
                setUpEventListeners();
            } catch (e) {
                console.error("Error accessing lunr");
            } finally {
                state.loading = false;
            }
        }
    };

    request.onerror = function () {
        console.error("There was a connection error of some sort");
        state.loading = false;
    };

    request.send(null);
}


// Suggestions Handlers

const listFocus = (i) => {
    state.focusIndex = i;
    renderNewDom();
}

const listUnfocus = (i) => {
    state.focusIndex = -1;
    renderNewDom();
}


// Box Event Handlers

const onInput = (event) => {
    state.query = event.target.value.trim();

    if (state.query === '') {
        state.isFocused = false;
    } else {
        state.isFocused = true;
    }

    const newSuggestions = getSuggestions(event.target.value);
    renderNewDom(newSuggestions);
}

const onBlur = () => {
    state.isFocused = false;
}

const onFocus = () => {
    state.isFocused = true;
}

const keyHandler = event => {
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
        go(state.focusIndex)
    }
}

// Key Handle Functions
const onUp = () => {
    state.focusIndex = clamp(
        state.focusIndex - 1,
        0,
        state.suggestions.length - 1
    );
    renderNewDom();
}

const onDown = () => {
    state.focusIndex = clamp(
        state.focusIndex + 1,
        0,
        state.suggestions.length - 1
    );
    renderNewDom();
}

const go = (i) => {
    if (!shouldShowSuggestions()) {
        return;
    }

    window.location.href = currentHostName + state.suggestions[i].href;
    state.query = "";
    state.focusIndex = 0;
}

const setUpEventListeners = () => {

    // Search Box Listeners.
    const searchBox = document.getElementById('search-box');
    searchBox.oninput = onInput;
    searchBox.onfocus = onFocus;
    searchBox.onblur = onBlur;
    searchBox.addEventListener("keyup", keyHandler);

    // Suggestions Listeners
    const searchBoxSuggestions = document.getElementById('search-box-suggestions');
    searchBoxSuggestions.addEventListener("mouseleave", listUnfocus);

    const spinner = document.getElementById('search-box-spinner');
    const searchContainer = document.getElementById('search-box-container');
    spinner.classList.add('hidden');
    searchContainer.classList.remove('hidden');
}

// Get documents
// Setup event listeners
// Hide spinner and make input visible
setUpState();
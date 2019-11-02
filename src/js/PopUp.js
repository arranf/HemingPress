let state = {};
export default function renderPopUp(updateEvent) {
    state.updateEvent = updateEvent;
    const div = document.createElement("div");
    div.classList.add("sw-update-popup");
    div.onclick = reload;

    const p = document.createElement("p");
    p.onclick = reload;
    const pText = "New content is available."
    const pTextNode = document.createTextNode(pText);

    const span = document.createElement("span");
    span.onclick = reload;
    const spanText = "Reload"
    const spanTextNode = document.createTextNode(spanText);

    span.appendChild(spanTextNode);
    p.appendChild(pTextNode);

    div.appendChild(p);
    div.appendChild(span);

    const popUpAnchor = document.getElementById('popup');
    popUpAnchor.appendChild(div);
}

function reload() {
    if (!state.updateEvent) {
        return;
    }

    state.updateEvent
        .skipWaiting()
        .then(() => {
            console.debug("Skip waiting succeeded");
            location.reload(true);
        })
        .catch(e => console.error(e));

    delete state.updateEvent;
}
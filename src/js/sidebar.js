let touchStart = {};

function onTouchStart(e) {
    touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
    }
}

function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchStart.x
    const dy = e.changedTouches[0].clientY - touchStart.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && touchStart.x <= 80) {
            setSidebar(true)
        } else {
            setSidebar(false)
        }
    }
}

function setSidebar(shouldBeOpen) {
    const themeContainer = document.getElementsByClassName('theme-container')[0];
    if (shouldBeOpen) {
        themeContainer.classList.add('sidebar-open')
    } else {
        themeContainer.classList.remove('sidebar-open')
    }
}

function toggleSidebar() {
    const themeContainer = document.getElementsByClassName('theme-container')[0];
    if (themeContainer.classList.contains('sidebar-open')) {
        setSidebar(false)
    } else {
        setSidebar(true)
    }
}

// Tests whether the DOM supports passive event handlers
// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
function supportsPassiveEvents() {
    let supportsPassive = false;
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
    } catch (e) {
        return supportsPassive;
    }
    return supportsPassive;
}

const supportsPassive = supportsPassiveEvents();
window.toggleSidebar = toggleSidebar

const themeContainer = document.getElementsByClassName('theme-container')[0];
themeContainer.addEventListener('touchstart', onTouchStart, supportsPassive ? { passive: true } : false);
themeContainer.addEventListener('touchend', onTouchEnd, supportsPassive ? { passive: true } : false);

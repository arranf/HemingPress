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
            setNavbar(true)
        } else {
            setNavbar(false)
        }
    }
}

function setNavbar(shouldBeOpen) {
    if (shouldBeOpen) {

        themeContainer.classList.add('sidebar-open')
    } else {

        themeContainer.classList.remove('sidebar-open')
    }
}

function toggleNavbar() {
    const themeContainer = document.getElementsByClassName('theme-container')[0];
    if (themeContainer.classList.contains('sidebar-open')) {
        setNavbar(false)
    } else {
        setNavbar(true)
    }
}

window.toggleNavbar = toggleNavbar

const themeContainer = document.getElementsByClassName('theme-container')[0];
themeContainer.addEventListener('touchstart', onTouchStart, false);
themeContainer.addEventListener('touchend', onTouchEnd, false);

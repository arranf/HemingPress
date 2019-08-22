//  onTouchStart(e) {
//     this.touchStart = {
//       x: e.changedTouches[0].clientX,
//       y: e.changedTouches[0].clientY
//     }
//   },
//   onTouchEnd(e) {
//     const dx = e.changedTouches[0].clientX - this.touchStart.x
//     const dy = e.changedTouches[0].clientY - this.touchStart.y
//     if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
//       if (dx > 0 && this.touchStart.x <= 80) {
//         this.toggleSidebar(true)
//       } else {
//         this.toggleSidebar(false)
//       }
//     }
//   }

function toggleNavbar() {
    const themeContainer = document.getElementsByClassName("theme-container")[0];
    if (themeContainer.classList.contains('sidebar-open')) {
        themeContainer.classList.remove('sidebar-open')
    } else {
        themeContainer.classList.add('sidebar-open')
    }
}

window.toggleNavbar = toggleNavbar
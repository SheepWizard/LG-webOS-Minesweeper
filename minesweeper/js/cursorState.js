let cursorSate = 0;

function cursorVisibilityChange(event) {
    cursorSate = event.detail.visibility;
}
document.addEventListener('cursorStateChange', cursorVisibilityChange, false);
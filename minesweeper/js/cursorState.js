let cursorState = 0;

function cursorVisibilityChange(event) {
    cursorState = event.detail.visibility;
}
document.addEventListener('cursorStateChange', cursorVisibilityChange, false);
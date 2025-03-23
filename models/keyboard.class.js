/**
 * Represents the keyboard input for the game.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});

/**
 * Adds event listeners for touch and mouse events to a button.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} key - The key to set in the keyboard object.
 */
function addEventListeners(buttonId, key) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    });
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    });
    button.addEventListener('touchcancel', (e) => { 
        e.preventDefault();
        keyboard[key] = false;
    });
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    });
    button.addEventListener('mouseup', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    });
    button.addEventListener('mouseleave', (e) => { 
        e.preventDefault();
        keyboard[key] = false;
    });
}

/**
 * Adds touch event listeners to the control buttons.
 */
function addTouchListeners() {
    addEventListeners('btnLeft', 'LEFT');
    addEventListeners('btnRight', 'RIGHT');
    addEventListeners('btnJump', 'SPACE');
    addEventListeners('btnJump', 'UP');
    addEventListeners('btnThrow', 'D');
}

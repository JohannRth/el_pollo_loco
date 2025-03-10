let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

/**
 * Initializes the game by setting up the canvas and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    addTouchListeners();
    loadMuteSetting();
    world.soundManager.playBackgroundMusic();
}

/**
 * Toggles the mute status of the game.
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteIcon = document.getElementById('mute-icon');
    if (isMuted) {
        muteIcon.src = 'img/sound/mute.png';
        world.soundManager.muteAll();
    } else {
        muteIcon.src = 'img/sound/unmute.png';
        world.soundManager.unmuteAll();
    }
    saveMuteSetting();
}

/**
 * Toggles the display of the panel-below.
 */
function toggleButtons() {
    const panelBelow = document.querySelector('.panel-below');
    if (panelBelow.style.display === 'none' || panelBelow.style.display === '') {
        panelBelow.style.display = 'flex';
    } else {
        panelBelow.style.display = 'none';
    }
}

/**
 * Loads the mute setting from localStorage.
 */
function loadMuteSetting() {
    const savedMuteSetting = localStorage.getItem('isMuted');
    if (savedMuteSetting !== null) {
        isMuted = JSON.parse(savedMuteSetting);
        const muteIcon = document.getElementById('mute-icon');
        if (isMuted) {
            muteIcon.src = 'img/sound/mute.png';
            world.soundManager.muteAll();
        } else {
            muteIcon.src = 'img/sound/unmute.png';
            world.soundManager.unmuteAll();
        }
    }
}

/**
 * Saves the mute setting to localStorage.
 */
function saveMuteSetting() {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
}

/**
 * Displays the main menu.
 */
function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('game').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('imprint').style.display = 'none';
    document.getElementById('win-loose').style.display = 'none';
}

/**
 * Starts the game by initializing the level and world.
 */
function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    initLevel();
    init();
}

/**
 * Displays the instructions screen.
 */
function showInstructions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'flex';
}

/**
 * Displays the imprint screen.
 */
function showImprint() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('imprint').style.display = 'flex';
}

/**
 * Handles the win condition of the game.
 */
function win() {
    world.winGame();
}

/**
 * Handles the game over condition.
 */
function gameOver() {
    world.endGame();
}

/**
 * Restarts the game.
 */
function playAgain() {
    document.getElementById('win-loose').style.display = 'none';
    startGame();
}

/**
 * Returns to the main menu.
 */
function backToMenu() {
    document.getElementById('win-loose').style.display = 'none';
    showMenu();
}
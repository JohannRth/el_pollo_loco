let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false; // Globale Variable zum Speichern des Mute-Status

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('My Character is', world.character);
    addTouchListeners(); // Event-Listener für die Buttons hinzufügen
}

function toggleMute() {
    isMuted = !isMuted;
    const muteIcon = document.getElementById('mute-icon');
    if (isMuted) {
        muteIcon.src = 'img/sound/mute.png';
    } else {
        muteIcon.src = 'img/sound/unmute.png';
    }
    console.log('Mute status:', isMuted);
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('game').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('imprint').style.display = 'none';
    document.getElementById('win-loose').style.display = 'none';
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    initLevel();
    init();
}

function showInstructions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'flex';
}

function showImprint() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('imprint').style.display = 'flex';
}

function win() {
    world.winGame(); // Aufruf der umbenannten Methode
}

function gameOver() {
    world.endGame(); // Aufruf der umbenannten Methode
}

function playAgain() {
    document.getElementById('win-loose').style.display = 'none';
    startGame();
}

function backToMenu() {
    document.getElementById('win-loose').style.display = 'none';
    showMenu();
}
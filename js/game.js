let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('My Character is', world.character);
    addTouchListeners(); // Event-Listener für die Buttons hinzufügen
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('game').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('imprint').style.display = 'none';
    document.getElementById('win').style.display = 'none';
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
    document.getElementById('win').style.display = 'flex';
}

function playAgain() {
    document.getElementById('win').style.display = 'none';
    startGame();
}

function backToMenu() {
    document.getElementById('win').style.display = 'none';
    showMenu();
}
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
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('imprint').style.display = 'none';
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    init();
}

function showInstructions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
}

function showImprint() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('imprint').style.display = 'block';
}
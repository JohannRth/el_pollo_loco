class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar(); // Bestehende Status-Bar für Gesundheit
    statusBarCoins = new CoinStatusBar(); // Neue Status-Bar für Coins
    statusBarBottles = new BottleStatusBar(); // Neue Status-Bar für Bottles
    coins = new Coin();
    bottles = new Bottle();
    throwableObjects = [];
    collectedCoins = 0; // Track collected coins

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50)
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.checkCoinCollection();
        this.checkEnemyCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingOnTop(enemy)) {
                this.handleEnemyCollisionOnTop(enemy, index);
            } else if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, index);
            }
        });
    }

    handleEnemyCollision(enemy, index) {
        // Charakter kollidiert mit dem Feind
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        console.log(`Collision with Character, index: ${index}, energy: ${this.character.energy}`);
    }

    handleEnemyCollisionOnTop(enemy, index) {
        // Charakter trifft den Feind von oben
        enemy.hit(); // Feind wird getroffen
        console.log(`Enemy hit from top, index: ${index}, energy: ${enemy.energy}`);
        if (enemy.energy <= 0) {
            enemy.die(); // Feind stirbt
            this.level.enemies.splice(index, 1); // Remove enemy from the level
            console.log(`Enemy died, index: ${index}`);
        }
    }

    checkCoinCollection() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1); // Remove coin from the level
                this.collectedCoins += 1; // Increment collected coins
                this.statusBarCoins.setPercentage(this.collectedCoins * 20); // Update coin status bar
                console.log(`Coin collected, total: ${this.collectedCoins}`);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Back
        // --------- Space for fixed objects ------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        this.ctx.translate(this.camera_x, 0); // Forwards

        this.ctx.translate(-this.camera_x, 0);

        // Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        if (objects && Array.isArray(objects)) {
            objects.forEach(o => {
                this.addToMap(o);
            });
        } else {
            console.error('Objects array is undefined or not an array:', objects);
        }
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx); // beide aufrufe sind bei drawable-objects
        mo.drawFrameOffset(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
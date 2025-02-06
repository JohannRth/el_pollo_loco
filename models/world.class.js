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
    collectedBottles = 0; // Track collected bottles
    lastThrownBottle = null; // Track the last thrown bottle

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
            this.checkCoinCollection();
            this.checkBottleCollection();
            this.checkEnemyCollisions();
            this.checkThrowObjects();
            this.checkBottleHits();
        }, 50);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.collectedBottles > 0 && this.canThrowBottle()) {
            this.throwBottle();
        }
    }

    throwBottle() {
        const bottleX = this.character.x + (this.character.otherDirection ? -50 : 50);
        const bottleY = this.character.y + 100;
        const bottle = new ThrowableObject(bottleX, bottleY, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.collectedBottles -= 1; // Decrement collected bottles
        this.statusBarBottles.setPercentage(this.collectedBottles * 20); // Update bottle status bar
        this.lastThrownBottle = bottle; // Set the last thrown bottle
        bottle.animate(); // Start bottle animation
        console.log(`Bottle thrown, remaining: ${this.collectedBottles}`);
    }

    canThrowBottle() {
        return !this.lastThrownBottle || this.lastThrownBottle.y > 500; // Allow throwing if no bottle has been thrown or if the last thrown bottle has fallen below y = 500
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
        let damage;
        if (enemy instanceof Chicken) {
            damage = 5;
        } else if (enemy instanceof MiniChicken) {
            damage = 2;
        } else if (enemy instanceof Endboss) {
            damage = 10;
        } else {
            damage = 0; // Default damage
        }

        this.character.hit(damage);
        this.statusBar.setPercentage(this.character.energy);
        console.log(`Collision with Character, index: ${index}, energy: ${this.character.energy}, damage: ${damage}`);
    }

    handleEnemyCollisionOnTop(enemy, index) {
        enemy.hit(); // Feind wird getroffen
        console.log(`Enemy hit from top, index: ${index}, energy: ${enemy.energy}`);
        if (enemy.energy <= 0) {
            enemy.die(); // Feind stirbt
            enemy.offset.top = 400; // Set offset to prevent further collisions
            this.scheduleEnemyRemoval(enemy);
        }
    }

    scheduleEnemyRemoval(enemy) {
        setTimeout(() => {
            const enemyIndex = this.level.enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                this.level.enemies.splice(enemyIndex, 1); // Remove enemy from the level after 1 second
                console.log(`Enemy died, index: ${enemyIndex}`);
            }
        }, 1000); // 1 second delay for dead animation
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

    checkBottleCollection() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1); // Remove bottle from the level
                this.collectedBottles += 1; // Increment collected bottles
                this.statusBarBottles.setPercentage(this.collectedBottles * 20); // Update bottle status bar
                console.log(`Bottle collected, total: ${this.collectedBottles}`);
            }
        });
    }

    checkBottleHits() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy)) {
                    enemy.hit(10); // Apply damage to enemy
                    this.throwableObjects.splice(bottleIndex, 1); // Remove bottle after hit
                    console.log(`Bottle hit enemy, enemy energy: ${enemy.energy}`);
                    if (enemy.energy <= 0) {
                        enemy.die();
                        enemy.offset.top = 400; // Set offset to prevent further collisions
                        this.scheduleEnemyRemoval(enemy);
                    }
                }
            });
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
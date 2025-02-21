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
    statusBarEndboss = new StatusBarEndboss(); // Neue Status-Bar für Endboss
    coins = new Coin();
    bottles = new Bottle();
    throwableObjects = [];
    collectedCoins = 0; // Track collected coins
    collectedBottles = 0; // Track collected bottles
    lastThrownBottle = null; // Track the last thrown bottle
    gamePaused = false; // Neue Variable zum Überprüfen, ob das Spiel pausiert ist
    soundManager = new SoundManager();

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
        this.gameInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.updateGame();
            }
        }, 50);
    }

    updateGame() {
        this.checkCoinCollection();
        this.checkBottleCollection();
        this.checkEnemyCollisions();
        ThrowableObject.checkThrowObjects(this.keyboard, this.character, this.throwableObjects, this.statusBarBottles, this.soundManager, this);
        ThrowableObject.checkBottleHits(this.throwableObjects, this.level.enemies, this.statusBarEndboss, this.soundManager, this);
        this.checkBossActivation();
    }

    pauseGame() {
        this.gamePaused = true;
        clearInterval(this.gameInterval); // Stop the game loop
    }

    resumeGame() {
        this.gamePaused = false;
        this.run(); // Restart the game loop
    }

    gameOver() {
        this.pauseGame();
        this.soundManager.play('gameOver');
        document.getElementById('win-loose-image').src = 'img/9_intro_outro_screens/game_over/game over.png';
        document.getElementById('win-loose').style.display = 'flex';
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
        let damage = this.calculateDamage(enemy);
        if (this.character.canTakeDamage()) {
            this.character.hit(damage);
            this.statusBar.setPercentage(this.character.energy);
            console.log(`Collision with Character, index: ${index}, energy: ${this.character.energy}, damage: ${damage}`);
            this.soundManager.play('hurt', 1000); // Play hurt sound with a cooldown of 1000ms
            if (this.character.isDead()) {
                this.gameOver(); // Spiel beenden, wenn der Charakter stirbt
            }
        }
    }

    calculateDamage(enemy) {
        if (enemy instanceof Chicken) {
            return 5;
        } else if (enemy instanceof MiniChicken) {
            return 3;
        } else if (enemy instanceof Endboss) {
            this.character.knockback(); // Character führt Rückstoß aus
            return 10;
        } else {
            return 0; // Default damage
        }
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
                if (enemy instanceof Endboss) {
                    this.pauseGame(); // Spiel pausieren, wenn der Endboss besiegt ist
                    this.soundManager.play('bossDead');
                    win(); // Show win overlay if the endboss is defeated
                }
            }
        }, 2000); // 2 second delay for dead animation
    }

    checkCoinCollection() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        });
    }

    collectCoin(index) {
        this.level.coins.splice(index, 1); // Remove coin from the level
        this.collectedCoins += 1; // Increment collected coins
        this.statusBarCoins.setPercentage(this.collectedCoins * 20); // Update coin status bar
        this.soundManager.play('coin');
        console.log(`Coin collected, total: ${this.collectedCoins}`);
    }

    checkBottleCollection() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        });
    }

    collectBottle(index) {
        this.level.bottles.splice(index, 1); // Remove bottle from the level
        this.collectedBottles += 1; // Increment collected bottles
        this.statusBarBottles.setPercentage(this.collectedBottles * 20); // Update bottle status bar
        this.soundManager.play('bottle');
        console.log(`Bottle collected, total: ${this.collectedBottles}`);
    }

    checkBossActivation() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                this.activateBossIfNeeded(enemy);
            }
        });
    }

    activateBossIfNeeded(enemy) {
        if (this.character.x > enemy.x - 500) {
            enemy.activateBossWithAlert();
            this.statusBarEndboss.setPercentage(enemy.energy); // Update status bar for endboss
        }
        if (this.character.x > enemy.x - 100 && this.character.x < enemy.x + 100) {
            enemy.isAttacking = true; // Set isAttacking to true when the character is very close to the endboss
        } else {
            enemy.isAttacking = false; // Set isAttacking to false when the character is not very close to the endboss
        }
    }

    draw() {
        if (this.gamePaused) return; // Stop drawing if the game is paused

        this.clearCanvas();
        this.drawBackground();
        this.drawMovableObjects();
        this.drawFixedObjects();

        // Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0); // Back
    }

    drawMovableObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0); // Back
    }

    drawFixedObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.bossIsActivated)) {
            this.addToMap(this.statusBarEndboss); // Status-Bar für Endboss hinzufügen, wenn aktiviert
        }
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
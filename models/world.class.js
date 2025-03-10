/**
 * Represents the game world.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar(); 
    statusBarCoins = new CoinStatusBar(); 
    statusBarBottles = new BottleStatusBar(); 
    statusBarEndboss = new StatusBarEndboss();
    coins = new Coin();
    bottles = new Bottle();
    throwableObjects = [];
    collectedCoins = 0; 
    collectedBottles = 0; 
    lastThrownBottle = null;
    gamePaused = false; 
    soundManager = new SoundManager();

    /**
     * Creates an instance of World.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Sets the world property for the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the game loop.
     */
    run() {
        this.gameInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.updateGame();
            }
        }, 50);
    }

    /**
     * Updates the game state.
     */
    updateGame() {
        this.checkCoinCollection();
        this.checkBottleCollection();
        this.checkEnemyCollisions();
        ThrowableObject.checkThrowObjects(this.keyboard, this.character, this.throwableObjects, this.statusBarBottles, this.soundManager, this);
        ThrowableObject.checkBottleHits(this.throwableObjects, this.level.enemies, this.statusBarEndboss, this.soundManager, this);
        this.checkBossActivation();
    }

    /**
     * Pauses the game.
     */
    pauseGame() {
        this.gamePaused = true;
        clearInterval(this.gameInterval); 
    }

    /**
     * Resumes the game.
     */
    resumeGame() {
        this.gamePaused = false;
        this.run(); 
    }

    /**
     * Ends the game and shows the game over screen.
     */
    endGame() { 
        this.pauseGame();
        this.stopAllIntervals(); 
        this.stopAllSounds(); 
        this.soundManager.play('gameOver');
        document.getElementById('win-loose-image').src = 'img/9_intro_outro_screens/game_over/game over.png';
        document.getElementById('win-loose').style.display = 'flex';
    }

    /**
     * Handles the win condition and shows the win screen.
     */
    winGame() { 
        this.pauseGame();
        this.stopAllIntervals(); 
        this.stopAllSounds(); 
        this.soundManager.play('win');
        document.getElementById('win-loose-image').src = 'img/9_intro_outro_screens/win/win_2.png';
        document.getElementById('win-loose').style.display = 'flex';
    }

    /**
     * Stops all animation and movement intervals.
     */
    stopAllIntervals() {
        clearInterval(this.gameInterval);
        this.character.stopAllIntervals();
        this.level.enemies.forEach(enemy => {
            if (typeof enemy.stopAllIntervals === 'function') {
                enemy.stopAllIntervals();
            }
        });
        this.throwableObjects.forEach(object => object.stopAllIntervals());
    }

    /**
     * Stops all sounds.
     */
    stopAllSounds() {
        Object.keys(this.soundManager.sounds).forEach(soundName => {
            this.soundManager.stop(soundName);
        });
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingOnTop(enemy)) {
                this.handleEnemyCollisionOnTop(enemy, index);
            } else if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, index);
            }
        });
    }

    /**
     * Handles the collision between the character and an enemy.
     * @param {MovableObject} enemy - The enemy that the character collided with.
     * @param {number} index - The index of the enemy in the enemies array.
     */
    handleEnemyCollision(enemy, index) {
        let damage = this.calculateDamage(enemy);
        if (this.character.canTakeDamage()) {
            this.character.hit(damage);
            this.statusBar.setPercentage(this.character.energy);
            this.soundManager.play('hurt', 1000); 
            if (this.character.isDead()) {
                this.endGame(); 
            }
        }
    }

    /**
     * Calculates the damage to inflict based on the type of enemy.
     * @param {MovableObject} enemy - The enemy to calculate damage for.
     * @returns {number} The amount of damage to inflict.
     */
    calculateDamage(enemy) {
        if (enemy instanceof Chicken) {
            return 10;
        } else if (enemy instanceof MiniChicken) {
            return 5;
        } else if (enemy instanceof Endboss) {
            this.character.knockback(); 
            return 20;
        } else {
            return 0; 
        }
    }

    /**
     * Handles the collision between the character and an enemy from the top.
     * @param {MovableObject} enemy - The enemy that the character collided with.
     * @param {number} index - The index of the enemy in the enemies array.
     */
    handleEnemyCollisionOnTop(enemy, index) {
        enemy.hit(); 
        if (enemy.energy <= 0) {
            enemy.die(); 
            enemy.offset.top = 400; 
            this.scheduleEnemyRemoval(enemy);
        }
    }

    /**
     * Schedules the removal of an enemy from the level.
     * @param {MovableObject} enemy - The enemy to remove.
     */
    scheduleEnemyRemoval(enemy) {
        setTimeout(() => {
            const enemyIndex = this.level.enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                this.level.enemies.splice(enemyIndex, 1); 
                if (enemy instanceof Endboss) {
                    this.pauseGame(); 
                    this.soundManager.play('bossDead');
                    this.winGame(); 
                }
            }
        }, 800); 
    }

    /**
     * Checks for coin collection by the character.
     */
    checkCoinCollection() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        });
    }

    /**
     * Collects a coin and updates the status bar.
     * @param {number} index - The index of the coin in the coins array.
     */
    collectCoin(index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins += 1; 
        this.statusBarCoins.setPercentage(this.collectedCoins * 20); 
        this.soundManager.play('coin');
    }

    /**
     * Checks for bottle collection by the character.
     */
    checkBottleCollection() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        });
    }

    /**
     * Collects a bottle and updates the status bar.
     * @param {number} index - The index of the bottle in the bottles array.
     */
    collectBottle(index) {
        this.level.bottles.splice(index, 1); 
        this.collectedBottles += 1; 
        this.statusBarBottles.setPercentage(this.collectedBottles * 20); 
        this.soundManager.play('bottle');
    }

    /**
     * Checks if the boss should be activated based on the character's position.
     */
    checkBossActivation() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                this.activateBossIfNeeded(enemy);
            }
        });
    }

    /**
     * Activates the boss if the character is close enough.
     * @param {Endboss} enemy - The endboss to activate.
     */
    activateBossIfNeeded(enemy) {
        if (this.character.x > enemy.x - 500) {
            enemy.activateBossWithAlert();
            this.statusBarEndboss.setPercentage(enemy.energy); 
            this.soundManager.pause('backgroundMusic'); 
            this.soundManager.playBossAlert(); 
        }
        if (this.character.x > enemy.x - 100 && this.character.x < enemy.x + 100) {
            enemy.isAttacking = true; 
        } else {
            enemy.isAttacking = false;
        }
    }

    /**
     * Draws the game world.
     */
    draw() {
        if (this.gamePaused) return;

        this.clearCanvas();
        this.drawBackground();
        this.drawMovableObjects();
        this.drawFixedObjects();

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Clears the canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the background objects.
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the movable objects.
     */
    drawMovableObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the fixed objects.
     */
    drawFixedObjects() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.bossIsActivated)) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Adds an array of objects to the map.
     * @param {Array} objects - The objects to add to the map.
     */
    addObjectsToMap(objects) {
        if (objects && Array.isArray(objects)) {
            objects.forEach(o => {
                this.addToMap(o);
            });
        } else {
            console.error('Objects array is undefined or not an array:', objects);
        }
    }

    /**
     * Adds a single object to the map.
     * @param {DrawableObject} mo - The object to add to the map.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx); // only for devolopment
        // mo.drawFrameOffset(this.ctx); // only for devolopment

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally.
     * @param {DrawableObject} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the image to its original orientation.
     * @param {DrawableObject} mo - The object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
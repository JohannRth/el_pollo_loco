/**
 * Class representing a throwable object in the game.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    soundManager = new SoundManager();

    BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates an instance of ThrowableObject.
     * @param {number} x - The x-coordinate of the object.
     * @param {number} y - The y-coordinate of the object.
     * @param {boolean} otherDirection - Indicates if the object is thrown in the opposite direction.
     */
    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.BOTTLE_ROTATION);
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.hasHit = false; 
        this.gravityInterval = null; 
        this.throw();
    }

    /**
     * Initiates the throw action for the object.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 30);
    }

    /**
     * Applies gravity to the object.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Animates the object by rotating it.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.BOTTLE_ROTATION);
        }, 60);
    }

    /**
     * Starts the splash animation when the object hits something.
     */
    startSplashAnimation() {
        clearInterval(this.throwInterval); 
        clearInterval(this.animateInterval); 
        clearInterval(this.gravityInterval); 
        this.speedY = 0; 
        this.playSplashAnimation();
    }

    /**
     * Plays the splash animation and marks the object as hit.
     */
    playSplashAnimation() {
        this.soundManager.play('bottleBreak', 1000);
        this.currentImage = 0; 
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.BOTTLE_SPLASH);
            if (this.currentImage >= this.BOTTLE_SPLASH.length) {
                clearInterval(this.animateInterval); 
                this.hasHit = true; 
            }
        }, 100);
    }

    /**
     * Checks if the player can throw a bottle based on the keyboard input and game state.
     * @param {Object} keyboard - The keyboard input object.
     * @param {Object} character - The character object.
     * @param {Array} throwableObjects - The array of throwable objects.
     * @param {Object} statusBarBottles - The status bar for bottles.
     * @param {Object} soundManager - The sound manager.
     * @param {Object} world - The game world object.
     */
    static checkThrowObjects(keyboard, character, throwableObjects, statusBarBottles, soundManager, world) {
        if (keyboard.D && world.collectedBottles > 0 && ThrowableObject.canThrowBottle(world)) {
            ThrowableObject.throwBottle(character, throwableObjects, statusBarBottles, soundManager, world);
        }
    }

    /**
     * Handles the logic for throwing a bottle.
     * @param {Object} character - The character throwing the bottle.
     * @param {Array} throwableObjects - The array of throwable objects.
     * @param {Object} statusBarBottles - The status bar for bottles.
     * @param {Object} soundManager - The sound manager.
     * @param {Object} world - The game world object.
     */
    static throwBottle(character, throwableObjects, statusBarBottles, soundManager, world) {
        const { bottle, collectedBottles } = ThrowableObject.createBottle(character, world.collectedBottles, statusBarBottles, soundManager, world);
        if (bottle) {
            throwableObjects.push(bottle);
            world.lastThrownBottle = bottle;
            world.collectedBottles = collectedBottles;
        }
    }

    /**
     * Checks if a bottle can be thrown based on the current state of the world.
     * @param {Object} world - The game world object.
     * @returns {boolean} - True if a bottle can be thrown, false otherwise.
     */
    static canThrowBottle(world) {
        return !world.lastThrownBottle || world.lastThrownBottle.y > 500;
    }

    /**
     * Checks if any throwable objects hit enemies.
     * @param {Array} throwableObjects - The array of throwable objects.
     * @param {Array} enemies - The array of enemies.
     * @param {Object} statusBarEndboss - The status bar for the end boss.
     * @param {Object} soundManager - The sound manager.
     * @param {Object} world - The game world object.
     */
    static checkBottleHits(throwableObjects, enemies, statusBarEndboss, soundManager, world) {
        throwableObjects.forEach((bottle, bottleIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (ThrowableObject.isBottleHittingEnemy(bottle, enemy)) {
                    ThrowableObject.handleBottleHit(bottle, bottleIndex, enemy, statusBarEndboss, soundManager, world);
                }
            });
        });
    }

    /**
     * Determines if a bottle is hitting an enemy.
     * @param {Object} bottle - The bottle object.
     * @param {Object} enemy - The enemy object.
     * @returns {boolean} - True if the bottle is hitting the enemy, false otherwise.
     */
    static isBottleHittingEnemy(bottle, enemy) {
        return bottle.isColliding(enemy) && !bottle.hasHit;
    }

    /**
     * Handles the logic when a bottle hits an enemy.
     * @param {Object} bottle - The bottle object.
     * @param {number} bottleIndex - The index of the bottle in the array.
     * @param {Object} enemy - The enemy object.
     * @param {Object} statusBarEndboss - The status bar for the end boss.
     * @param {Object} soundManager - The sound manager.
     * @param {Object} world - The game world object.
     */
    static handleBottleHit(bottle, bottleIndex, enemy, statusBarEndboss, soundManager, world) {
        enemy.hit(20);
        bottle.startSplashAnimation();
        if (enemy instanceof Endboss) {
            statusBarEndboss.setPercentage(enemy.energy);
        }
        if (enemy.energy <= 0) {
            enemy.die();
            enemy.offset.top = 400;
            ThrowableObject.scheduleEnemyRemovalFromWorld(enemy, world);
        }
        bottle.hasHit = true;
        ThrowableObject.removeBottleAfterAnimation(bottleIndex, world);
    }

    /**
     * Removes the bottle from the world after the splash animation completes.
     * @param {number} bottleIndex - The index of the bottle in the array.
     * @param {Object} world - The game world object.
     */
    static removeBottleAfterAnimation(bottleIndex, world) {
        setTimeout(() => {
            world.throwableObjects.splice(bottleIndex, 1);
            world.lastThrownBottle = null;
        }, 600);
    }

    /**
     * Creates a new bottle object.
     * @param {Object} character - The character throwing the bottle.
     * @param {number} collectedBottles - The number of collected bottles.
     * @param {Object} statusBarBottles - The status bar for bottles.
     * @param {Object} soundManager - The sound manager.
     * @param {Object} world - The game world object.
     * @returns {Object} - An object containing the new bottle and the updated number of collected bottles.
     */
    static createBottle(character, collectedBottles, statusBarBottles, soundManager, world) {
        if (collectedBottles > 0) {
            const bottleX = character.x + (character.otherDirection ? -50 : 50);
            const bottleY = character.y + 100;
            const bottle = new ThrowableObject(bottleX, bottleY, character.otherDirection);
            bottle.world = world; 
            collectedBottles -= 1;
            statusBarBottles.setPercentage(collectedBottles * 20);
            bottle.animate();
            soundManager.play('throw');
            return { bottle, collectedBottles };
        }
        return { bottle: null, collectedBottles };
    }

    /**
     * Schedules the removal of an enemy from the world.
     * @param {Object} enemy - The enemy object.
     * @param {Object} world - The game world object.
     */
    static scheduleEnemyRemovalFromWorld(enemy, world) { 
        setTimeout(() => {
            const enemyIndex = world.level.enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                world.level.enemies.splice(enemyIndex, 1);
                if (enemy instanceof Endboss) {
                    world.pauseGame();
                    world.soundManager.play('bossDead');
                    win();
                    world.soundManager.play('win');
                }
            }
        }, 2000);
    }

    /**
     * Stops all intervals for the object.
     */
    stopAllIntervals() {
        clearInterval(this.throwInterval);
        clearInterval(this.gravityInterval);
        clearInterval(this.animateInterval);
    }
}
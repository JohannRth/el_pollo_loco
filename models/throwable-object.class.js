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

    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.BOTTLE_ROTATION);
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.hasHit = false; // Initialize hasHit property
        this.gravityInterval = null; // Initialize gravity interval
        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 30);
    }

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    animate() {
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.BOTTLE_ROTATION);
        }, 60);
    }

    startSplashAnimation() {
        clearInterval(this.throwInterval); // Stop bottle movement
        clearInterval(this.animateInterval); // Stop rotation animation
        clearInterval(this.gravityInterval); // Stop gravity
        this.speedY = 0; // Stop vertical movement
        this.playSplashAnimation();
    }

    playSplashAnimation() {
        this.soundManager.play('bottleBreak', 1000);
        this.currentImage = 0; // Reset animation frame
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.BOTTLE_SPLASH);
            if (this.currentImage >= this.BOTTLE_SPLASH.length) {
                clearInterval(this.animateInterval); // Stop splash animation after it completes
                this.hasHit = true; // Mark bottle as hit
            }
        }, 100);
    }

    static checkThrowObjects(keyboard, character, throwableObjects, statusBarBottles, soundManager, world) {
        if (keyboard.D && world.collectedBottles > 0 && ThrowableObject.canThrowBottle(world)) {
            ThrowableObject.throwBottle(character, throwableObjects, statusBarBottles, soundManager, world);
        }
    }

    static throwBottle(character, throwableObjects, statusBarBottles, soundManager, world) {
        const { bottle, collectedBottles } = ThrowableObject.createBottle(character, world.collectedBottles, statusBarBottles, soundManager, world);
        if (bottle) {
            throwableObjects.push(bottle);
            world.lastThrownBottle = bottle;
            world.collectedBottles = collectedBottles;
        }
    }

    static canThrowBottle(world) {
        return !world.lastThrownBottle || world.lastThrownBottle.y > 500;
    }

    static checkBottleHits(throwableObjects, enemies, statusBarEndboss, soundManager, world) {
        throwableObjects.forEach((bottle, bottleIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (ThrowableObject.isBottleHittingEnemy(bottle, enemy)) {
                    ThrowableObject.handleBottleHit(bottle, bottleIndex, enemy, statusBarEndboss, soundManager, world);
                }
            });
        });
    }

    static isBottleHittingEnemy(bottle, enemy) {
        return bottle.isColliding(enemy) && !bottle.hasHit;
    }

    static handleBottleHit(bottle, bottleIndex, enemy, statusBarEndboss, soundManager, world) {
        enemy.hit(100);
        bottle.startSplashAnimation();
        console.log(`Bottle hit enemy, enemy energy: ${enemy.energy}`);
        if (enemy instanceof Endboss) {
            statusBarEndboss.setPercentage(enemy.energy);
        }
        if (enemy.energy <= 0) {
            enemy.die();
            enemy.offset.top = 400;
            ThrowableObject.scheduleEnemyRemoval(enemy, world);
        }
        bottle.hasHit = true;
        ThrowableObject.removeBottleAfterAnimation(bottleIndex, world);
    }

    static removeBottleAfterAnimation(bottleIndex, world) {
        setTimeout(() => {
            world.throwableObjects.splice(bottleIndex, 1);
            world.lastThrownBottle = null;
        }, 600);
    }

    static createBottle(character, collectedBottles, statusBarBottles, soundManager, world) {
        if (collectedBottles > 0) {
            const bottleX = character.x + (character.otherDirection ? -50 : 50);
            const bottleY = character.y + 100;
            const bottle = new ThrowableObject(bottleX, bottleY, character.otherDirection);
            bottle.world = world; // Set the world property
            collectedBottles -= 1;
            statusBarBottles.setPercentage(collectedBottles * 20);
            bottle.animate();
            soundManager.play('throw');
            console.log(`Bottle thrown, remaining: ${collectedBottles}`);
            return { bottle, collectedBottles };
        }
        return { bottle: null, collectedBottles };
    }

    static scheduleEnemyRemoval(enemy, world) {
        setTimeout(() => {
            const enemyIndex = world.level.enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                world.level.enemies.splice(enemyIndex, 1);
                console.log(`Enemy died, index: ${enemyIndex}`);
                if (enemy instanceof Endboss) {
                    world.pauseGame();
                    world.soundManager.play('bossDead');
                    win();
                    world.soundManager.play('win');
                }
            }
        }, 2000);
    }
}
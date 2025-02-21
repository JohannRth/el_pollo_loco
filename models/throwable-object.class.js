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

    static throwBottle(character, collectedBottles, statusBarBottles, soundManager) {
        if (collectedBottles > 0) {
            const bottleX = character.x + (character.otherDirection ? -50 : 50);
            const bottleY = character.y + 100;
            const bottle = new ThrowableObject(bottleX, bottleY, character.otherDirection);
            collectedBottles -= 1; // Decrement collected bottles
            statusBarBottles.setPercentage(collectedBottles * 20); // Update bottle status bar
            bottle.animate(); // Start bottle animation
            soundManager.play('throw');
            console.log(`Bottle thrown, remaining: ${collectedBottles}`);
            return { bottle, collectedBottles };
        }
        return { bottle: null, collectedBottles };
    }
}
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    damageCooldown = 200; // 0.4 second cooldown
    lastDamageTime = 0;
    bossIsActivated = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) { //Throwable Object should always fall
            return true;
        } else {
            return this.y < 180;
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    isCollidingOnTop(mo) {
        const isOnTop = this.y + this.height >= mo.y && this.y + this.height <= mo.y + 50;
        const isHorizontallyAligned = this.x + this.width > mo.x && this.x < mo.x + mo.width;
        const isFalling = this.speedY < 0;
        return isOnTop && isHorizontallyAligned && isFalling;
    }

    hit(damage = 1) {
        this.energy -= damage;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            this.lastDamageTime = this.lastHit; // Update last damage time
        }
    }

    canTakeDamage() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastDamageTime >= this.damageCooldown;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Differce in ms
        timepassed = timepassed / 1000; //Difference in s
        return timepassed < 0.5;
    }

    isDead() {
        return this.energy <= 0;
    }

    isWaiting() {
        if (!this.world.keyboard.D && !this.world.keyboard.LEFT && !this.world.keyboard.RIGHT && !this.world.keyboard.SPACE && !this.isAboveGround()) {
            return true;
        }
    }

    die() {
        this.energy = 0;
        this.speed = 0; // Stop enemy movement
        this.isDead = true; // Mark the object as dead
    }

    activateBoss() {
        if (!this.bossIsActivated) {
            this.bossIsActivated = true;
        }
        return this.bossIsActivated;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 0 % 10;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }
}
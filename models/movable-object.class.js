class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    damageCooldown = 200; 
    lastDamageTime = 0;
    bossIsActivated = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Applies gravity to the object.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if the object is above the ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { 
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks if the object is colliding with another movable object.
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean} True if the objects are colliding, false otherwise.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Checks if the object is colliding on top of another movable object.
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean} True if the object is colliding on top, false otherwise.
     */
    isCollidingOnTop(mo) {
        const isOnTop = this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top && 
                        this.y + this.height - this.offset.bottom <= mo.y + mo.offset.top + 30;
        const isHorizontallyAligned = this.x + this.width - this.offset.right > mo.x + mo.offset.left && 
                                      this.x + this.offset.left < mo.x + mo.width - mo.offset.right;
        const isFalling = this.speedY < 0;
        return isOnTop && isHorizontallyAligned && isFalling;
    }

    /**
     * Reduces the object's energy by the specified damage.
     * @param {number} [damage=1] - The amount of damage.
     */
    hit(damage = 1) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            this.lastDamageTime = this.lastHit; 
        }
    }

    /**
     * Checks if the object can take damage.
     * @returns {boolean} True if the object can take damage, false otherwise.
     */
    canTakeDamage() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastDamageTime >= this.damageCooldown;
    }

    /**
     * Checks if the object is hurt.
     * @returns {boolean} True if the object is hurt, false otherwise.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; 
        timepassed = timepassed / 1000; 
        return timepassed < 0.5;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if the object is dead, false otherwise.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Checks if the object is waiting.
     * @returns {boolean} True if the object is waiting, false otherwise.
     */
    isWaiting() {
        if (!this.world.keyboard.D && !this.world.keyboard.LEFT && !this.world.keyboard.RIGHT && !this.world.keyboard.SPACE && !this.isAboveGround()) {
            return true;
        }
    }

    /**
     * Kills the object.
     */
    die() {
        this.energy = 0;
        this.speed = 0; 
        this.isDead = true; 
    }

    /**
     * Activates the boss.
     * @returns {boolean} True if the boss is activated, false otherwise.
     */
    activateBoss() {
        if (!this.bossIsActivated) {
            this.bossIsActivated = true;
        }
        return this.bossIsActivated;
    }

    /**
     * Applies knockback to the object.
     */
    knockback() {
        let distance = 200; 
        let steps = 10; 
        let stepSize = distance / steps; 
        let step = 0;

        let interval = setInterval(() => {
            if (step < steps) {
                this.x -= stepSize;
                step++;
            } else {
                clearInterval(interval);
            }
        }, 20); 
    }

    /**
     * Plays the specified animation.
     * @param {Array<string>} images - The array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; 
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Changes the direction of the object when it reaches the edge of its area.
     */
    changeDirection() {
        if (this.x < this.initialX - 100) {
            this.direction = 'right';
        } else if (this.x > this.initialX + 100) {
            this.direction = 'left';
        }
    }
}
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

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

    // isColliding(mo) {
    //     return this.x + this.width > mo.x &&
    //         this.y + this.height > mo.y &&
    //         this.x < mo.x + mo.width &&
    //         this.y < mo.y + mo.height;
    // }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height -mo.offset.bottom;
    }

    isCollidingOnTop(mo) {
        const isOnTop = this.y + this.height >= mo.y && this.y + this.height <= mo.y + 50;
        const isHorizontallyAligned = this.x + this.width > mo.x && this.x < mo.x + mo.width;
        const isFalling = this.speedY < 0;
        return isOnTop && isHorizontallyAligned && isFalling;
    }

    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
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





// if (Character.x + character.width > chicken.x && character.y + character.height > chicken.y && character.x < chicken.x && character.y < chicken.y + chicken.height) // Bessere Formel zur Kollisionsberechnung (Genauer)
//     isColliding(obj) {
//     return (this.X + this.width) >= obj.X && this.X <= (obj.X + obj.width) &&
//         (this.Y + this.offsetY + this.height) >= obj.Y &&
//         (this.Y + this.offsetY) <= (obj.Y + obj.height) &&
//         obj.onCollisionCourse; // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.

// }
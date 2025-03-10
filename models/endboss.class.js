/**
 * Represents the Endboss character in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    energy = 100;
    height = 400;
    width = 250;
    speed = 1;
    x = 2200;
    y = 60;

    offset = {
        left: 30,
        right: 30,
        top: 80,
        bottom: 40
    };

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    soundManager = new SoundManager();
    statusBarEndboss = new StatusBarEndboss();
    isAttacking = false;
    isHurtAnimationPlaying = false; 

    /**
     * Creates an instance of Endboss.
     * @param {number} x - The initial x-coordinate of the Endboss.
     * @param {number} y - The initial y-coordinate of the Endboss.
     */
    constructor(x, y){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = x;
        this.y = y;
        this.alertPlayedOff = false; 
        this.statusBarEndboss.setPercentage(this.energy);
        this.animate();
    }

    /**
     * Reduces the energy of the Endboss by the specified damage.
     * @param {number} [damage=1] - The amount of damage to inflict.
     */
    hit(damage = 1) {
        this.soundManager.play('bossHurt', 1000);
        super.hit(damage);
        this.statusBarEndboss.setPercentage(this.energy);
        this.isHurtAnimationPlaying = true; 
        setTimeout(() => {
            this.isHurtAnimationPlaying = false; 
        }, 500); 
    }

    /**
     * Animates the Endboss by switching between different images.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            if (super.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (!this.alertPlayedOff) {
                this.playAnimation(this.IMAGES_ALERT);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        this.movementInterval = setInterval(() => {
            if (this.bossIsActivated && !this.isHurtAnimationPlaying && !this.isAttacking) { 
                this.moveLeft();
            }
        }, 1000 / 60);

        this.scheduleRandomAttack();
    }

    /**
     * Schedules a random attack for the endboss.
     */
    scheduleRandomAttack() {
        setInterval(() => {
            if (!super.isDead() && this.bossIsActivated) {
                this.performAttack();
            }
        }, 2000 + Math.random() * 3000); 
    }

    /**
     * Performs an attack by moving quickly to the left and then quickly back to the right.
     */
    performAttack() {
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_ATTACK); 
        let originalSpeed = this.speed;
        this.moveLeftQuickly(200, 10, () => {
            this.moveRightQuickly(90, 10, () => {
                this.restoreOriginalSpeed(originalSpeed);
            });
        });
    }

    /**
     * Moves the endboss quickly to the left.
     * @param {number} distance - The distance to move.
     * @param {number} speed - The speed of the movement.
     * @param {Function} callback - The callback function to call after the movement is complete.
     */
    moveLeftQuickly(distance, speed, callback) {
        let attackInterval = setInterval(() => {
            if (distance > 0) {
                this.x -= speed;
                distance -= speed;
            } else {
                clearInterval(attackInterval);
                callback();
            }
        }, 1000 / 60);
    }

    /**
     * Moves the endboss quickly to the right.
     * @param {number} distance - The distance to move.
     * @param {number} speed - The speed of the movement.
     * @param {Function} callback - The callback function to call after the movement is complete.
     */
    moveRightQuickly(distance, speed, callback) {
        let returnInterval = setInterval(() => {
            if (distance > 0) {
                this.x += speed;
                distance -= speed;
            } else {
                clearInterval(returnInterval);
                callback();
            }
        }, 1000 / 60);
    }

    /**
     * Restores the original speed of the endboss.
     * @param {number} originalSpeed - The original speed to restore.
     */
    restoreOriginalSpeed(originalSpeed) {
        this.isAttacking = false;
        this.speed = originalSpeed;
    }

    /**
     * Activates the boss with an alert animation and sound.
     */
    activateBossWithAlert() {
        if (!this.bossIsActivated) {
            this.playAnimation(this.IMAGES_ALERT);
            setTimeout(() => {
                this.bossIsActivated = this.activateBoss();
                this.alertPlayedOff = true;
            }, 1000); 
        }
    }

    /**
     * Applies a knockback effect to the Endboss.
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
     * Stops all animation and movement intervals.
     */
    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
        clearInterval(this.attackInterval); 
        clearInterval(this.returnInterval); 
    }
}
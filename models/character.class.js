/**
 * Represents the main character in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {

    height = 250;
    width = 100;
    y = 200;
    speed = 6;

    offset = {
        top: 95,
        left: 18,
        right: 23,
        bottom: 5
    };

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ]

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    world;
    walking_sound = new Audio('audio/running.mp3');
    soundManager = new SoundManager();

    /**
     * Creates an instance of Character.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
    }

    /**
     * Checks if the character is dead.
     * @returns {boolean} True if the character is dead, otherwise false.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Resets the character's properties to their initial values.
     */
    reset() {
        this.energy = 100;
        this.isDead = false;
        this.x = 120;
        this.y = 280;
    }

    /**
     * Animates the character by handling movement and animations.
     */
    animate() {
        this.handleMovement();
        this.handleAnimations();
        this.handleIdleAnimation();
    }

    /**
     * Handles the character's movement.
     */
    handleMovement() {
        this.movementInterval = setInterval(() => {
            let isWalking = this.checkWalking();
            this.handleWalkingSound(isWalking);
            this.checkJumping();
            this.updateCamera();
        }, 1000 / 60);
    }

    /**
     * Checks if the character is walking.
     * @returns {boolean} True if the character is walking, otherwise false.
     */
    checkWalking() {
        let isWalking = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            isWalking = true;
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            isWalking = true;
        }
        return isWalking;
    }

    /**
     * Checks if the character is jumping.
     */
    checkJumping() {
        if (this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.soundManager.play('jump', 1000); 
        }
    }

    /**
     * Updates the camera position based on the character's position.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles the walking sound based on the character's movement.
     * @param {boolean} isWalking - True if the character is walking, otherwise false.
     */
    handleWalkingSound(isWalking) {
        if (isWalking) {
            this.soundManager.play('walking'); 
        } else {
            this.soundManager.pause('walking'); 
        }
    }

    /**
     * Handles the character's animations.
     */
    handleAnimations() {
        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.soundManager.play('dead', 9999999999); 
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.soundManager.play('hurt', 1500);
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            };
        }, 90);
    }

    /**
     * Handles the character's idle animation.
     */
    handleIdleAnimation() {
        this.idleInterval = setInterval(() => {
            if (this.isWaiting()) {
                this.playAnimation(this.IMAGES_IDLE);
                this.timer += 300; 
                if (this.timer >= 7000) { 
                    this.playAnimation(this.IMAGES_LONGIDLE);
                    this.soundManager.play('snoring', 18000); 
                }
            } else {
                this.timer = 0; 
                this.soundManager.stop('snoring'); 
            }
        }, 300); 
    }

    /**
     * Stops all animation and movement intervals.
     */
    stopAllIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        clearInterval(this.idleInterval);
        this.handleWalkingSound(false); 
        this.soundManager.stop('snoring'); 
     }

}
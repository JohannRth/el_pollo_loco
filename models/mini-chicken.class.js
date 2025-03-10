class MiniChicken extends MovableObject {
    y = 380;
    height = 40;
    width = 40;
    energy = 1;

    offset = {
        left: 5,
        right: 3,
        top: 5,
        bottom: 5
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    /**
     * Creates an instance of MiniChicken.
     * @param {number} x - The x-coordinate of the mini chicken.
     * @param {number} y - The y-coordinate of the mini chicken.
     */
    constructor(x, y) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = x;
        this.y = y;
        this.initialX = x; 
        this.speed = 0.3 + Math.random() * 0.5;
        this.isDead = false; 
        this.direction = 'left'; 
        this.animate();
    }

    /**
     * Animates the mini chicken by moving it within a specific area and playing the appropriate animation.
     */
    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.changeDirection();
                if (this.direction === 'left') {
                    this.moveLeft();
                    this.otherDirection = false;
                } else {
                    this.moveRight();
                    this.otherDirection = true;
                }
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 60);
    }
}
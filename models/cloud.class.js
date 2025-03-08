class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    
    /**
     * Creates an instance of Cloud.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Animates the cloud by moving it to the left.
     */
    animate() {
        this.moveLeft();
    }
}
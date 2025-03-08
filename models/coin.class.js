class Coin extends MovableObject {
    y = 130;
    height = 150;
    width = 150;

    offset = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    };

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates an instance of Coin.
     * @param {number} x - The x-coordinate of the coin.
     * @param {number} y - The y-coordinate of the coin.
     */
    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Animates the coin by playing the coin animation.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
}

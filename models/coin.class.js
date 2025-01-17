class Coin extends MovableObject {
    y = 130;
    height = 200;
    width = 200;

    offset = {
        left: 69,
        right: 69,
        top: 69,
        bottom: 69
    };

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = 350 ;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
}

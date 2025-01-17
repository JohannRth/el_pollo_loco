class Bottle extends MovableObject {
    y = 370;
    height = 200
    width = 200

    BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];

    constructor() {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 400;
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.BOTTLE_GROUND);
        }, 160);
    }

}

class Bottle extends MovableObject {
    y = 350;
    height = 100
    width = 100

    offset = {
        left: 40,
        right: 20,
        top: 20,
        bottom: 10
    };

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

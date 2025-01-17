class Bottle extends MovableObject {
    y = 360;
    height = 80;
    width = 80;

    offset = {
        left: 30,
        right: 20,
        top: 10,
        bottom: 10
    };

    BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];

    constructor(x) {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.BOTTLE_GROUND);
        }, 160);
    }

}

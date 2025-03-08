class Bottle extends MovableObject {
    y = 370;
    height = 70;
    width = 70;

    offset = {
        left: 30,
        right: 10,
        top: 10,
        bottom: 10
    };

    BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];

    /**
     * Creates an instance of Bottle.
     * @param {number} x - The x-coordinate of the bottle.
     * @param {number} y - The y-coordinate of the bottle.
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
    }
}

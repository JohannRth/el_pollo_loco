let level1;
/**
 * Initializes the first level of the game.
 */
function initLevel() {

level1 = new Level(
    [
        new Chicken(450, 380),
        new MiniChicken(800, 392),
        new Chicken(1000, 380),
        new MiniChicken(1300, 392),
        new Chicken(1450, 380),
        new Chicken(1600, 380),
        new Chicken(1800, 380),
        new Endboss(2200, 60)
    ],

    [
        new Cloud()
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ],

    [
        new Coin(500, 100),
        new Coin(800, 180),
        new Coin(1100, 100),
        new Coin(1350, 150),
        new Coin(1600, 100),
    ],

    [
        new Bottle(300, 370),
        new Bottle(600, 370),
        new Bottle(900, 370),
        new Bottle(1200, 370),
        new Bottle(1500, 370),
    ]
);
}
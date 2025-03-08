/**
 * Represents a level in the game.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2200;

    /**
     * Creates an instance of Level.
     * @param {Array} enemies - The enemies in the level.
     * @param {Array} clouds - The clouds in the level.
     * @param {Array} backgroundObjects - The background objects in the level.
     * @param {Array} coins - The coins in the level.
     * @param {Array} bottles - The bottles in the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2500;

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.level_end_x = this.level_end_x;
    }
}
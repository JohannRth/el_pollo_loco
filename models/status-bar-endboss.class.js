/**
 * Represents the status bar for the end boss in the game.
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {
    STATUSBAR_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    percentage = 100;

    /**
     * Creates an instance of StatusBarEndboss.
     */
    constructor() {
        super();
        this.loadImages(this.STATUSBAR_ENDBOSS);
        this.x = 480;
        this.y = 7;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the percentage of the status bar.
     * @param {number} percentage - The percentage to set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.STATUSBAR_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
}
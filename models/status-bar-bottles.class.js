/**
 * Represents the status bar for bottles in the game.
 * @extends DrawableObject
 */
class BottleStatusBar extends DrawableObject {

    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',  
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',  
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',  
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',  
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',  
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png', 
    ];

    percentage = 0;

    /**
     * Creates an instance of BottleStatusBar.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;  
        this.y = 80;  
        this.width = 200;
        this.height = 60;
        this.setPercentage(0); 
    }

    /**
     * Sets the percentage of the status bar.
     * @param {number} percentage - The percentage to set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
}


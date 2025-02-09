class StatusBarEndboss extends DrawableObject {



    STATUSBAR_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 440;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
        this.statusBarEndboss = document.querySelector('.status-bar-endboss');
        this.statusBarEndboss.style.width = '100%';
    }
}
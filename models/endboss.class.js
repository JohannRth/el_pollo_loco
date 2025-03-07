class Endboss extends MovableObject {
    energy = 100;
    height = 400;
    width = 250;
    speed = 0.8;
    x = 2200;
    y = 60;

    offset = {
        left: 30,
        right: 30,
        top: 80,
        bottom: 40
    };

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    soundManager = new SoundManager();
    statusBarEndboss = new StatusBarEndboss();
    isAttacking = false;
    isHurtAnimationPlaying = false; // Add flag to indicate Hurt animation playing

    constructor(x, y){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = x;
        this.y = y;
        this.alertPlayedOff = false; // Initialize alertPlayedOff property
        this.statusBarEndboss.setPercentage(this.energy);
        this.animate();
    }

    hit(damage = 1) {
        this.soundManager.play('bossHurt', 1000);
        super.hit(damage);
        this.statusBarEndboss.setPercentage(this.energy);
        this.isHurtAnimationPlaying = true; // Set flag to true when hit
        setTimeout(() => {
            this.isHurtAnimationPlaying = false; // Reset flag after Hurt animation duration
        }, 500); // Assuming Hurt animation duration is 500ms
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (super.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (!this.alertPlayedOff) {
                this.playAnimation(this.IMAGES_ALERT);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        this.movementInterval = setInterval(() => {
            if (this.bossIsActivated && !this.isHurtAnimationPlaying) { // Prevent movement during Hurt animation
                this.moveLeft();
            }
        }, 1000 / 60);
    }

    activateBossWithAlert() {
        if (!this.bossIsActivated) {
            this.soundManager.play('bossAlert', 1000);
            this.playAnimation(this.IMAGES_ALERT);
            setTimeout(() => {
                this.bossIsActivated = this.activateBoss();
                this.alertPlayedOff = true;
            }, 1000); // Duration of alert animation
        }
    }

    knockback() {
        let distance = 200; // Gesamtstrecke des Rückstoßes
        let steps = 10; // Anzahl der Schritte
        let stepSize = distance / steps; // Wie viel pro Schritt bewegt wird
        let step = 0;

        let interval = setInterval(() => {
            if (step < steps) {
                this.x -= stepSize;
                step++;
            } else {
                clearInterval(interval);
            }
        }, 20); // Alle 20ms bewegen
    }

    stopAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
    }
}
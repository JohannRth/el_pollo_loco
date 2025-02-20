class SoundManager {
    constructor() {
        this.sounds = {
            walking: new Audio('audio/running.mp3'),
            jump: new Audio('audio/jump.mp3'),
            hurt: new Audio('audio/hurt.mp3'),
            dead: new Audio('audio/dead.mp3'),
            coin: new Audio('audio/coin.mp3'),
            bottle: new Audio('audio/bottle.mp3'),
            throw: new Audio('audio/throw.mp3'),
            bossAlert: new Audio('audio/boss_alert.mp3'),
            bossHurt: new Audio('audio/boss_hurt.mp3'),
            bossDead: new Audio('audio/boss_dead.mp3'),
            win: new Audio('audio/win.mp3'),
            gameOver: new Audio('audio/game_over.mp3')
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        } else {
            console.error(`Sound ${soundName} not found`);
        }
    }

    pause(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
        } else {
            console.error(`Sound ${soundName} not found`);
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        } else {
            console.error(`Sound ${soundName} not found`);
        }
    }
}

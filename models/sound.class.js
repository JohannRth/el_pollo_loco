class SoundManager {
    constructor() {
        this.sounds = {
            walking: new Audio('audio/walking.mp3'),
            jump: new Audio('audio/jump.mp3'),
            snoring: new Audio('audio/snoring.mp3'),
            hurt: new Audio('audio/hurt.mp3'),
            dead: new Audio('audio/dead.mp3'),
            coin: new Audio('audio/coin.mp3'),
            bottle: new Audio('audio/bottle.mp3'),
            bottleBreak: new Audio('audio/bottle_break.mp3'),
            throw: new Audio('audio/throw.mp3'),
            chickenDead: new Audio('audio/chicken_dead.mp3'),
            bossAlert: new Audio('audio/boss_alert.mp3'),
            bossHurt: new Audio('audio/boss_hurt.mp3'),
            bossDead: new Audio('audio/boss_dead.mp3'),
            win: new Audio('audio/win.mp3'),
            gameOver: new Audio('audio/game_over.mp3')
        };
        this.lastPlayed = {}; // Track the last played time for each sound
        this.volume = 1.0; // Default volume

        // Set initial volume for each sound
        this.setInitialVolumes();
        this.monitorVolume(); // Start monitoring volume
    }

    setInitialVolumes() {
        this.sounds.walking.initialVolume = 0.5;
        this.sounds.jump.initialVolume = 0.5;
        this.sounds.snoring.initialVolume = 0.1;
        this.sounds.hurt.initialVolume = 0.5;
        this.sounds.dead.initialVolume = 0.5;
        this.sounds.coin.initialVolume = 0.5;
        this.sounds.bottle.initialVolume = 0.5;
        this.sounds.bottleBreak.initialVolume = 0.5;
        this.sounds.throw.initialVolume = 0.5;
        this.sounds.chickenDead.initialVolume = 0.5;
        this.sounds.bossAlert.initialVolume = 0.5;
        this.sounds.bossHurt.initialVolume = 0.5;
        this.sounds.bossDead.initialVolume = 0.5;
        this.sounds.win.initialVolume = 0.5;
        this.sounds.gameOver.initialVolume = 0.5;

        // Apply initial volumes
        this.setAllVolumes();
    }

    setVolume(volume) {
        this.volume = volume;
        this.setAllVolumes();
    }

    play(soundName, cooldown = 1000, volume = this.volume) {
        if (isMuted) return; // Keine Sounds abspielen, wenn stummgeschaltet
        const currentTime = new Date().getTime();
        if (this.sounds[soundName]) {
            if (!this.lastPlayed[soundName] || currentTime - this.lastPlayed[soundName] >= cooldown) {
                this.sounds[soundName].volume = volume; // Set the volume
                this.sounds[soundName].currentTime = 0; // Reset the sound to the beginning
                this.sounds[soundName].play().catch(() => {
                    // Error handling without console.error()
                });
                this.lastPlayed[soundName] = currentTime; // Update the last played time
            }
        }
    }

    pause(soundName) {
        if (this.sounds[soundName] && !this.sounds[soundName].paused) {
            this.sounds[soundName].pause();
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            if (!this.sounds[soundName].paused) {
                this.sounds[soundName].pause();
            }
            this.sounds[soundName].currentTime = 0;
        }
    }

    pauseAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            this.pause(soundName);
        });
    }

    stopAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stop(soundName);
        });
    }

    setAllVolumes() {
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].volume = isMuted ? 0 : this.sounds[soundName].initialVolume;
        });
    }

    monitorVolume() {
        setInterval(() => {
            this.setAllVolumes();
        }, 100); // Check and set volume every 100ms
    }
}

/**
 * Manages the sounds in the game.
 */
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
            gameOver: new Audio('audio/game_over.mp3'),
            backgroundMusic: new Audio('audio/bg-music.mp3')
        };
        this.lastPlayed = {}; 
        this.volume = 1.0; 

        this.setInitialVolumes();
        this.monitorVolume(); 
    }

    /**
     * Sets the initial volumes for each sound.
     */
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
        this.sounds.bossAlert.initialVolume = 0.3;
        this.sounds.bossHurt.initialVolume = 0.5;
        this.sounds.bossDead.initialVolume = 0.5;
        this.sounds.win.initialVolume = 0.5;
        this.sounds.gameOver.initialVolume = 0.5;
        this.sounds.backgroundMusic.initialVolume = 0.1; 

        this.setAllVolumes();
    }

    /**
     * Sets the volume for all sounds.
     * @param {number} volume - The volume level to set.
     */
    setVolume(volume) {
        this.volume = volume;
        this.setAllVolumes();
    }

    /**
     * Plays the specified sound.
     * @param {string} soundName - The name of the sound to play.
     * @param {number} [cooldown=1000] - The cooldown time in milliseconds.
     * @param {number} [volume=this.volume] - The volume level to set.
     */
    play(soundName, cooldown = 1000, volume = this.volume) {
        if (isMuted) return;
        const currentTime = new Date().getTime();
        if (this.sounds[soundName]) {
            if (!this.lastPlayed[soundName] || currentTime - this.lastPlayed[soundName] >= cooldown) {
                this.sounds[soundName].volume = volume;
                this.sounds[soundName].currentTime = 0; 
                this.sounds[soundName].play().catch(() => {
                });
                this.lastPlayed[soundName] = currentTime; 
            }
        }
    }

    /**
     * Plays the background music in a loop.
     */
    playBackgroundMusic() {
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.play().catch(() => {
        });
    }

    /**
     * Plays the boss alert sound in a loop.
     */
    playBossAlert() {
        this.sounds.bossAlert.loop = true;
        this.sounds.bossAlert.play().catch(() => {
        });
    }

    /**
     * Pauses the specified sound.
     * @param {string} soundName - The name of the sound to pause.
     */
    pause(soundName) {
        if (this.sounds[soundName] && !this.sounds[soundName].paused) {
            this.sounds[soundName].pause();
        }
    }

    /**
     * Stops the specified sound.
     * @param {string} soundName - The name of the sound to stop.
     */
    stop(soundName) {
        if (this.sounds[soundName]) {
            if (!this.sounds[soundName].paused) {
                this.sounds[soundName].pause();
            }
            this.sounds[soundName].currentTime = 0;
        }
    }

    /**
     * Pauses all sounds.
     */
    pauseAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            this.pause(soundName);
        });
    }

    /**
     * Stops all sounds.
     */
    stopAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stop(soundName);
        });
    }

    /**
     * Sets the volume for all sounds based on the current volume level.
     */
    setAllVolumes() {
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].volume = isMuted ? 0 : this.sounds[soundName].initialVolume;
        });
    }

    /**
     * Monitors and updates the volume for all sounds.
     */
    monitorVolume() {
        setInterval(() => {
            this.setAllVolumes();
        }, 100);
    }

    /**
     * Mutes all sounds.
     */
    muteAll() {
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].volume = 0;
        });
    }

    /**
     * Unmutes all sounds.
     */
    unmuteAll() {
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].volume = this.sounds[soundName].initialVolume;
        });
    }
}

/* ===================== AUDIO SYSTEM ===================== */

// Audio state
let audioContext;
let masterGain;
let musicEnabled = true;
let sfxEnabled = true;
let musicPlaying = false;

// Initialize audio
function initAudio() {
    try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create master volume control
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.value = 0.7;

        console.log("Audio system initialized");
        setupAudioControls();

    } catch (error) {
        console.log("Audio initialization failed:", error);
        return false;
    }
    return true;
}

// Setup audio control buttons
function setupAudioControls() {
    const musicBtn = document.getElementById('musicToggle');
    const sfxBtn = document.getElementById('sfxToggle');
    const volumeSlider = document.getElementById('volumeSlider');

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    if (sfxBtn) {
        sfxBtn.addEventListener('click', toggleSFX);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            changeVolume(this.value);
        });
    }
}

// Toggle background music
function toggleMusic() {
    musicEnabled = !musicEnabled;
    const btn = document.getElementById('musicToggle');
    if (btn) {
        btn.textContent = musicEnabled ? '🎵' : '🔇';
    }

    if (musicEnabled && musicPlaying) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }

    playClickSound();
}

// Toggle sound effects
function toggleSFX() {
    sfxEnabled = !sfxEnabled;
    const btn = document.getElementById('sfxToggle');
    if (btn) {
        btn.textContent = sfxEnabled ? '🔊' : '🔇';
    }

    playClickSound();
}

// Change volume
function changeVolume(value) {
    if (masterGain) {
        masterGain.gain.value = value / 100;
    }
}

// Play click sound
function playClickSound() {
    if (!sfxEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log("Click sound error:", error);
    }
}

// Play eat sound
function playEatSound() {
    if (!sfxEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1046, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log("Eat sound error:", error);
    }
}

// Play game over sound
function playGameOverSound() {
    if (!sfxEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(349, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(174, audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
        console.log("Game over sound error:", error);
    }
}

// Play high score sound
function playHighScoreSound() {
    if (!sfxEnabled || !audioContext) return;

    try {
        // Play victory fanfare
        const notes = [523, 659, 784, 1047];
        const times = [0, 0.1, 0.2, 0.3];

        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(masterGain);

                oscillator.type = 'sine';
                oscillator.frequency.value = freq;

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            }, times[i] * 1000);
        });
    } catch (error) {
        console.log("High score sound error:", error);
    }
}

// Background music
function playBackgroundMusic() {
    if (!musicEnabled || !audioContext) return;

    musicPlaying = true;

    try {
        // Simple arpeggio pattern
        const notes = [262, 330, 392, 494];
        let noteIndex = 0;

        function playNextNote() {
            if (!musicPlaying) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(masterGain);

            oscillator.type = ['sine', 'square', 'triangle'][noteIndex % 3];
            oscillator.frequency.value = notes[noteIndex % notes.length];

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);

            noteIndex++;

            // Schedule next note
            setTimeout(playNextNote, 300);
        }

        playNextNote();
    } catch (error) {
        console.log("Background music error:", error);
    }
}

function stopBackgroundMusic() {
    musicPlaying = false;
}

// Unlock audio on user interaction
function unlockAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Initialize on user interaction
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

// Export functions for other files
window.playClickSound = playClickSound;
window.playEatSound = playEatSound;
window.playGameOverSound = playGameOverSound;
window.playHighScoreSound = playHighScoreSound;
window.playBackgroundMusic = playBackgroundMusic;
window.stopBackgroundMusic = stopBackgroundMusic;
window.toggleMusic = toggleMusic;
window.toggleSFX = toggleSFX;
window.changeVolume = changeVolume;
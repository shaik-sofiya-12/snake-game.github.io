/* ===================== BACKGROUND ANIMATIONS ===================== */
function createStars() {
  const container = document.getElementById('starsContainer');
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'floating-star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = 1 + Math.random() * 4 + 's';
    container.appendChild(star);
  }
}

// Create sweeping laser beams - FIXED VERSION
function createLasers() {
    const container = document.getElementById('lasersContainer');
    if (!container) return;

    for (let i = 0; i < 8; i++) {
        const laser = document.createElement('div');
        laser.className = 'laser-beam';

        // Set random properties
        laser.style.top = Math.random() * 100 + 'vh';
        laser.style.width = Math.random() * 100 + 200 + 'px';

        // Random rotation for each laser
        const rotation = Math.random() * 10 - 5;
        laser.style.transform = `rotate(${rotation}deg)`;

        // Random animation delay and duration
        laser.style.animationDelay = Math.random() * 4 + 's';
        laser.style.animationDuration = 3 + Math.random() * 3 + 's';

        // Random color gradient
        const colors = [
            'cyan',
            'magenta',
            'yellow',
            '#00f7ff',
            '#ff00ff',
            '#ffff00'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        laser.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        laser.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

        container.appendChild(laser);
    }
}

// Create orbiting particles - FIXED VERSION
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const orbitAnimations = ['particleOrbit', 'particleOrbit2', 'particleOrbit3', 'particleOrbit4'];

    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'color-particle';

        // Set size
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Choose random orbit animation
        const orbitType = orbitAnimations[Math.floor(Math.random() * orbitAnimations.length)];
        particle.style.animationName = orbitType;

        // Random animation properties
        const duration = 8 + Math.random() * 8;
        const delay = Math.random() * 10;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        // Random color
        const colors = ['#00f7ff', '#ff00ff', '#ffff00', 'cyan', 'magenta', 'yellow'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px ${color}`;

        container.appendChild(particle);
    }
}
/* ===================== IMPROVED BACKGROUND MUSIC ===================== */
let audioContext;
let masterGain;
let musicEnabled = true;
let sfxEnabled = true;
let musicNotes = [];
let currentNote = 0;

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.7;

    console.log("Audio context initialized");
    return true;
  } catch (e) {
    console.log("Web Audio API not supported");
    return false;
  }
}

function unlockAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

function changeVolume(value) {
  if (masterGain) {
    masterGain.gain.value = value / 100;
  }
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  const btn = document.getElementById('musicToggle');
  btn.textContent = musicEnabled ? '🎵' : '🔇';

  if (musicEnabled) {
    playBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
  playClickSound();
}

function toggleSFX() {
  sfxEnabled = !sfxEnabled;
  const btn = document.getElementById('sfxToggle');
  btn.textContent = sfxEnabled ? '🔊' : '🔇';
  playClickSound();
}

/* ===================== BACKGROUND MUSIC ===================== */
function playBackgroundMusic() {
  if (!musicEnabled || !audioContext) return;

  // Create a more interesting arpeggio
  const baseNotes = [261.63, 329.63, 392.00, 493.88]; // C4, E4, G4, B4
  const sequence = [];

  // Generate a cosmic arpeggio pattern
  for (let i = 0; i < 16; i++) {
    const noteIndex = i % baseNotes.length;
    const octave = Math.floor(i / baseNotes.length) % 3;
    const note = baseNotes[noteIndex] * Math.pow(2, octave);
    sequence.push({
      frequency: note,
      duration: 0.3,
      type: i % 3 === 0 ? 'sawtooth' : i % 3 === 1 ? 'square' : 'triangle'
    });
  }

  musicNotes = sequence;
  currentNote = 0;
  playNextMusicNote();
}

function playNextMusicNote() {
  if (!musicEnabled || !audioContext || currentNote >= musicNotes.length) {
    currentNote = 0;
    setTimeout(() => {
      if (musicEnabled) playBackgroundMusic();
    }, 500);
    return;
  }

  const note = musicNotes[currentNote];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.type = note.type;
  oscillator.frequency.value = note.frequency;

  // Add some randomness for a cosmic feel
  oscillator.detune.value = Math.random() * 50 - 25;

  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + note.duration);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + note.duration);

  currentNote++;
  setTimeout(playNextMusicNote, note.duration * 1000);
}

function stopBackgroundMusic() {
  musicNotes = [];
  currentNote = 0;
}

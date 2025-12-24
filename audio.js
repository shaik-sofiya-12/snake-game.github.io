/* ===================== SOUND EFFECTS ===================== */
function playClickSound() {
  if (!sfxEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playEatSound() {
  if (!sfxEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.15); // C6

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
}

function playGameOverSound() {
  if (!sfxEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
  oscillator.frequency.exponentialRampToValueAtTime(174.61, audioContext.currentTime + 0.8); // F3

  gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.8);
}

function playHighScoreSound() {
  if (!sfxEnabled || !audioContext) return;

  // Cosmic victory fanfare
  const notes = [
    { freq: 523.25, time: 0, type: 'sine' },    // C5
    { freq: 659.25, time: 0.1, type: 'square' }, // E5
    { freq: 783.99, time: 0.2, type: 'sine' },  // G5
    { freq: 1046.50, time: 0.3, type: 'square' }, // C6
    { freq: 1318.51, time: 0.4, type: 'sine' }, // E6
  ];

  notes.forEach(note => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.type = note.type;
    oscillator.frequency.value = note.freq;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.3);

    oscillator.start(audioContext.currentTime + note.time);
    oscillator.stop(audioContext.currentTime + note.time + 0.3);
  });
}

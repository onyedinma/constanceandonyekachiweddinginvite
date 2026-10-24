/**
 * WEDDING AUDIO HARMONY & SYNTHESIZER ENGINE
 * Constance Onyinyechi David & Onyekachi Onyedinma Wedding
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let melodyTimer = null;
  let audioElem = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Harmonic chord progressions (Classical Canon / Royal Wedding Elegance)
  // Frequencies for a romantic D Major / Celtic Harp arpeggio
  const NOTES = {
    D3: 146.83, Fs3: 185.00, A3: 220.00,
    D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
    Cs5: 554.37, D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00
  };

  // Romantic arpeggiated patterns
  const ARPEGGIO_SEQUENCE = [
    // D Major
    NOTES.D4, NOTES.Fs4, NOTES.A4, NOTES.D5,
    // A Major
    NOTES.Cs5, NOTES.A4, NOTES.E4, NOTES.A3,
    // B Minor
    NOTES.B4, NOTES.Fs4, NOTES.D4, NOTES.B3,
    // F# Minor
    NOTES.A4, NOTES.Fs4, NOTES.Cs4, NOTES.Fs3,
    // G Major
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G4,
    // D Major
    NOTES.Fs4, NOTES.D4, NOTES.A3, NOTES.D4,
    // G Major
    NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5,
    // A7
    NOTES.Cs5, NOTES.A4, NOTES.G4, NOTES.E4
  ];

  // Pluck a physical acoustic-style harp note
  function playHarpNote(freq, timeOffset = 0, duration = 2.4) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + timeOffset;

    // Dual Oscillators for warm acoustic string body
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime); // Harmonic overtone

    // Lowpass filter simulates warm acoustic wooden resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);

    // Natural plucked string envelope: instant attack, long warm exponential decay
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  // Play royal opening ceremony chime
  function playChime() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chimeChords = [NOTES.D4, NOTES.Fs4, NOTES.A4, NOTES.D5, NOTES.Fs5];
    chimeChords.forEach((note, idx) => {
      playHarpNote(note, idx * 0.12, 3.5);
    });
  }

  // Continuous loop of arpeggios
  let noteIndex = 0;
  function startMelodyLoop() {
    if (melodyTimer) clearInterval(melodyTimer);

    noteIndex = 0;
    melodyTimer = setInterval(() => {
      if (!isPlaying) return;
      const freq = ARPEGGIO_SEQUENCE[noteIndex % ARPEGGIO_SEQUENCE.length];
      playHarpNote(freq, 0, 2.5);
      noteIndex++;
    }, 420);
  }

  function togglePlay() {
    const controller = document.querySelector('.audio-controller');
    const label = document.querySelector('.audio-label');

    getAudioContext();

    if (isPlaying) {
      isPlaying = false;
      if (melodyTimer) clearInterval(melodyTimer);
      if (controller) controller.classList.remove('audio-playing');
      if (label) label.textContent = 'Play Music';
    } else {
      isPlaying = true;
      startMelodyLoop();
      if (controller) controller.classList.add('audio-playing');
      if (label) label.textContent = 'Sound On';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const controller = document.querySelector('.audio-controller');
    if (controller) {
      controller.addEventListener('click', togglePlay);
    }
  });

  window.WeddingAudio = {
    togglePlay,
    playChime,
    isPlaying: () => isPlaying
  };
})();

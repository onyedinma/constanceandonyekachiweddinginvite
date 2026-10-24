/**
 * WEDDING AUDIO HARMONY & MUSIC PLAYER ENGINE
 * Constance Onyinyechi David & Onyekachi Onyedinma Wedding
 * Featured Song: "Running (To You)" by Chike feat. Simi
 */

(function () {
  'use strict';

  const AUDIO_SRC = 'assets/audio/wedding-song.mp3';
  const TARGET_VOLUME = 0.7;
  let audioElem = null;
  let isPlaying = false;
  let fadeInterval = null;
  let audioCtx = null;
  let melodyTimer = null;
  let useFallbackSynth = false;

  // 1. Initialize Web Audio Context (for wax-seal chime and fallback)
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

  // Harmonic chord frequencies for unsealing ceremony chime
  const NOTES = {
    D3: 146.83, Fs3: 185.00, A3: 220.00,
    D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
    Cs5: 554.37, D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00
  };

  const ARPEGGIO_SEQUENCE = [
    NOTES.D4, NOTES.Fs4, NOTES.A4, NOTES.D5,
    NOTES.Cs5, NOTES.A4, NOTES.E4, NOTES.A3,
    NOTES.B4, NOTES.Fs4, NOTES.D4, NOTES.B3,
    NOTES.A4, NOTES.Fs4, NOTES.Cs4, NOTES.Fs3,
    NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G4,
    NOTES.Fs4, NOTES.D4, NOTES.A3, NOTES.D4
  ];

  function playHarpNote(freq, timeOffset = 0, duration = 2.4) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime + timeOffset;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.5, startTime);
      filter.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);

      gainNode.gain.setValueAtTime(0.001, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.1);
      osc2.stop(startTime + duration + 0.1);
    } catch (e) {}
  }

  // Romantic Harp Chime Chord upon breaking the wax seal
  function playChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const chimeChords = [NOTES.D4, NOTES.Fs4, NOTES.A4, NOTES.D5, NOTES.Fs5];
    chimeChords.forEach((note, idx) => {
      playHarpNote(note, idx * 0.1, 3.2);
    });
  }

  // Fallback Synth Loop if mp3 fails
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

  // 2. Initialize HTML5 Audio Element for "Running (To You)"
  function initAudioElement() {
    if (audioElem) return audioElem;

    audioElem = document.getElementById('wedding-audio-player');
    if (!audioElem) {
      audioElem = new Audio();
      audioElem.id = 'wedding-audio-player';
      audioElem.src = AUDIO_SRC;
      document.body.appendChild(audioElem);
    }

    audioElem.loop = true;
    audioElem.preload = 'auto';
    audioElem.volume = 0;

    audioElem.addEventListener('ended', () => {
      if (isPlaying) {
        audioElem.currentTime = 0;
        audioElem.play().catch(() => {});
      }
    });

    audioElem.addEventListener('error', () => {
      console.warn('Wedding audio asset failed to load, switching to acoustic harp synthesizer.');
      useFallbackSynth = true;
      if (isPlaying) {
        startMelodyLoop();
      }
    });

    return audioElem;
  }

  // Smooth volume fade helper
  function fadeVolume(targetVol, durationMs, onComplete) {
    if (fadeInterval) clearInterval(fadeInterval);
    if (!audioElem) return;

    const startVol = audioElem.volume;
    const steps = 25;
    const stepTime = durationMs / steps;
    const volStep = (targetVol - startVol) / steps;
    let stepCount = 0;

    fadeInterval = setInterval(() => {
      stepCount++;
      const nextVol = startVol + (volStep * stepCount);
      if (stepCount >= steps) {
        audioElem.volume = Math.max(0, Math.min(1, targetVol));
        clearInterval(fadeInterval);
        fadeInterval = null;
        if (typeof onComplete === 'function') onComplete();
      } else {
        audioElem.volume = Math.max(0, Math.min(1, nextVol));
      }
    }, stepTime);
  }

  // Update UI Controller Appearance
  function updateUI(playing) {
    const controller = document.querySelector('.audio-controller');
    const label = document.querySelector('.audio-label');

    if (controller) {
      if (playing) {
        controller.classList.add('audio-playing');
        controller.setAttribute('title', 'Pause Music ("Running To You" - Chike & Simi)');
      } else {
        controller.classList.remove('audio-playing');
        controller.setAttribute('title', 'Play Music ("Running To You" - Chike & Simi)');
      }
    }
    if (label) {
      label.textContent = playing ? 'Sound On' : 'Play Music';
    }
  }

  // Core Play method
  function playSong(fadeIn = true) {
    initAudioElement();
    getAudioContext();

    if (useFallbackSynth) {
      isPlaying = true;
      updateUI(true);
      startMelodyLoop();
      return;
    }

    if (audioElem) {
      if (fadeIn) {
        audioElem.volume = 0;
      } else {
        audioElem.volume = TARGET_VOLUME;
      }

      const promise = audioElem.play();
      if (promise !== undefined) {
        promise.then(() => {
          isPlaying = true;
          updateUI(true);
          if (fadeIn) {
            fadeVolume(TARGET_VOLUME, 1800);
          }
        }).catch(err => {
          console.warn('Playback prevented or waiting for interaction:', err);
          // Wait for any user click
          const onFirstInteraction = () => {
            document.removeEventListener('click', onFirstInteraction);
            document.removeEventListener('touchstart', onFirstInteraction);
            playSong(true);
          };
          document.addEventListener('click', onFirstInteraction, { once: true });
          document.addEventListener('touchstart', onFirstInteraction, { once: true });
        });
      }
    }
  }

  // Core Pause method
  function pauseSong(fadeOut = true) {
    isPlaying = false;
    updateUI(false);

    if (melodyTimer) {
      clearInterval(melodyTimer);
      melodyTimer = null;
    }

    if (audioElem && !audioElem.paused) {
      if (fadeOut) {
        fadeVolume(0, 600, () => {
          audioElem.pause();
        });
      } else {
        audioElem.pause();
        audioElem.volume = 0;
      }
    }
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (isPlaying) {
      pauseSong(true);
    } else {
      playSong(true);
    }
  }

  // Triggered when breaking the wax seal
  function unsealAndPlay() {
    playChime();
    // Play immediately in this user event turn so mobile browsers allow it!
    setTimeout(() => {
      playSong(true);
    }, 400);
  }

  // Boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAudioElement();

    const controller = document.querySelector('.audio-controller');
    if (controller) {
      controller.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    // Auto-resume if previously unsealed during this session
    const hasUnsealed = sessionStorage.getItem('wedding_unsealed') === 'true';
    if (hasUnsealed) {
      // Don't auto-blast on reload, but attach interaction trigger
      const resumeOnGesture = () => {
        if (!isPlaying) {
          playSong(true);
        }
        document.removeEventListener('click', resumeOnGesture);
        document.removeEventListener('touchstart', resumeOnGesture);
      };
      document.addEventListener('click', resumeOnGesture, { once: true });
      document.addEventListener('touchstart', resumeOnGesture, { once: true });
    }
  });

  // Public API
  window.WeddingAudio = {
    play: () => playSong(true),
    pause: () => pauseSong(true),
    togglePlay,
    playChime,
    unsealAndPlay,
    isPlaying: () => isPlaying
  };
})();

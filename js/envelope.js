/**
 * 3D ENVELOPE UNSEALING CEREMONY & TILT ENGINE
 * Constance & Onyekachi Wedding Invitation
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal');
    const unsealBtn = document.getElementById('unseal-btn');
    const card3d = document.querySelector('.invitation-card-3d');
    const cardWrap = document.querySelector('.invitation-card-3d-wrap');

    let hasUnsealed = false;

    // Check if user already unsealed previously in session
    if (sessionStorage.getItem('wedding_unsealed') === 'true') {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('unsealed');
        hasUnsealed = true;
      }
    }

    // 1. TILT EFFECT ON ENVELOPE (3D Gyro/Mouse)
    if (envelopeWrapper) {
      envelopeWrapper.addEventListener('mousemove', (e) => {
        if (hasUnsealed) return;
        const rect = envelopeWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 15;

        envelopeWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      envelopeWrapper.addEventListener('mouseleave', () => {
        if (hasUnsealed) return;
        envelopeWrapper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }

    // 2. TILT EFFECT ON MAIN INVITATION CARD
    if (cardWrap && card3d) {
      cardWrap.addEventListener('mousemove', (e) => {
        const rect = cardWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 8;
        const rotateY = (x / (rect.width / 2)) * 10;

        card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      cardWrap.addEventListener('mouseleave', () => {
        card3d.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }

    // 3. UNSEALING CEREMONY TRIGGER
    function triggerUnsealing() {
      if (hasUnsealed) return;
      hasUnsealed = true;
      sessionStorage.setItem('wedding_unsealed', 'true');

      if (envelopeWrapper) {
        envelopeWrapper.classList.add('opening');
      }

      // Audio Harps / Chimes & Wedding Song
      if (window.WeddingAudio) {
        if (typeof window.WeddingAudio.unsealAndPlay === 'function') {
          window.WeddingAudio.unsealAndPlay();
        } else if (typeof window.WeddingAudio.playChime === 'function') {
          window.WeddingAudio.playChime();
          setTimeout(() => {
            if (!window.WeddingAudio.isPlaying()) {
              window.WeddingAudio.togglePlay();
            }
          }, 1000);
        }
      }

      // Golden & Emerald Confetti Cannon
      if (typeof confetti === 'function') {
        const count = 200;
        const defaults = {
          origin: { y: 0.6 }
        };

        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#d4af37', '#e5c378', '#faf8f2']
        });
        fire(0.2, {
          spread: 60,
          colors: ['#094d36', '#c05820', '#6b1426']
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: ['#fcf6ba', '#d4af37', '#aa771c']
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#ffffff', '#e5c378']
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ['#043927', '#ffd700']
        });
      }

      // Reveal Main Invitation Page
      setTimeout(() => {
        if (envelopeOverlay) {
          envelopeOverlay.classList.add('unsealed');
        }

        // Animate hero card into view
        if (typeof gsap !== 'undefined') {
          gsap.from('.invitation-card-3d', {
            duration: 1.4,
            y: 80,
            opacity: 0,
            scale: 0.9,
            ease: 'power3.out'
          });

          gsap.from('.hero-actions', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
          });
        }
      }, 1400);
    }

    if (waxSeal) {
      waxSeal.addEventListener('click', triggerUnsealing);
    }
    if (unsealBtn) {
      unsealBtn.addEventListener('click', triggerUnsealing);
    }

    // Expose replay function for user
    window.replayUnsealing = function () {
      sessionStorage.removeItem('wedding_unsealed');
      if (envelopeOverlay) {
        envelopeOverlay.classList.remove('unsealed');
      }
      if (envelopeWrapper) {
        envelopeWrapper.classList.remove('opening');
      }
      hasUnsealed = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });
})();

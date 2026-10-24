/**
 * RSVP SYSTEM, PERSISTENT BACKEND API, WHATSAPP DISPATCH & LIVE GUESTBOOK WALL
 * Constance & Onyekachi Wedding
 */

(function () {
  'use strict';

  const DEFAULT_WISHES = [
    {
      id: "wish-1",
      author: "Elder & Deaconess Amadi",
      text: "May the almighty Lord establish your home in everlasting peace, divine favor, and overflowing fruitfulness! Congratulations Constance and Onyekachi!",
      time: "2 hours ago"
    },
    {
      id: "wish-2",
      author: "Engr. Maurice Jr. & Family",
      text: "A match ordained from heaven. Songs of Solomon 3:4 is fulfilled in your lives. We cannot wait to celebrate with you both in Port Harcourt!",
      time: "Yesterday"
    },
    {
      id: "wish-3",
      author: "Dr. Chioma N.",
      text: "So thrilled for my dearest Constance! You are going to make the most angelic bride. God bless your new union richly!",
      time: "2 days ago"
    },
    {
      id: "wish-4",
      author: "Barrister & Mrs. E. Eze",
      text: "Warmest congratulations to the David & Onyedinma families. Wishing you joy that knows no bounds as two become one flesh.",
      time: "3 days ago"
    }
  ];

  // Load wishes from REST API, fallback to localStorage or defaults
  async function fetchWishes() {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('wedding_wishes', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      // Offline or local static preview
    }

    const stored = localStorage.getItem('wedding_wishes');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }

    return DEFAULT_WISHES;
  }

  async function renderWishes() {
    const container = document.getElementById('wishes-container');
    if (!container) return;

    const wishes = await fetchWishes();
    container.innerHTML = '';

    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(w.author || w.name)}</span>
          <span class="wish-time">${escapeHTML(w.time || 'Recently')}</span>
        </div>
        <p class="wish-text">“${escapeHTML(w.text || w.message)}”</p>
      `;
      container.appendChild(card);
    });
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Modal helpers
  const modalBackdrop = document.getElementById('rsvp-modal-backdrop');
  const modalCloseBtn = document.getElementById('rsvp-modal-close');
  const modalSummary = document.getElementById('rsvp-modal-summary');
  const modalWhatsAppBtn = document.getElementById('rsvp-modal-whatsapp');

  function openSuccessModal(rsvpData, waUrl) {
    if (modalSummary) {
      modalSummary.innerHTML = `
        <strong>Guest Name:</strong> ${escapeHTML(rsvpData.name)}<br>
        <strong>Attendance:</strong> ${escapeHTML(rsvpData.status)}<br>
        <strong>Party Size:</strong> ${escapeHTML(rsvpData.guests)}<br>
        ${rsvpData.phone ? `<strong>Phone:</strong> ${escapeHTML(rsvpData.phone)}<br>` : ''}
        ${rsvpData.message ? `<strong>Your Prayer:</strong> “${escapeHTML(rsvpData.message)}”` : ''}
      `;
    }
    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.setAttribute('href', waUrl);
    }
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function closeSuccessModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSuccessModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSuccessModal();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderWishes();

    // RSVP Form Submit
    const rsvpForm = document.getElementById('wedding-rsvp-form');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('rsvp-name').value.trim();
        const phone = document.getElementById('rsvp-phone').value.trim();
        const status = document.getElementById('rsvp-status').value;
        const guests = document.getElementById('rsvp-guests').value;
        const message = document.getElementById('rsvp-message').value.trim();

        if (!name) {
          alert('Please enter your name.');
          return;
        }

        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        const origBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Recording RSVP...`;
        }

        const payload = {
          name,
          phone,
          status,
          guests,
          message
        };

        // 1. Send to Netlify Forms & Local Backend API
        try {
          const formData = new FormData(rsvpForm);
          formData.append('form-name', 'wedding-rsvp');
          await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
          });
        } catch (netlifyErr) {
          // Not running on Netlify
        }

        try {
          await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {}

        // 2. Also cache in localStorage for instant offline access
        if (message) {
          const stored = localStorage.getItem('wedding_wishes');
          let wishes = [];
          try {
            wishes = JSON.parse(stored) || [];
          } catch (e) {
            wishes = [];
          }
          wishes.unshift({
            id: 'wish-' + Date.now(),
            author: name,
            text: message,
            time: 'Just now'
          });
          localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
        }

        // 3. Render updated wishes wall
        renderWishes();

        // 4. Confetti blast
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#094d36', '#d4af37', '#c05820', '#6b1426', '#ffd700']
          });
        }

        // 5. Generate structured WhatsApp message for 07040182980
        const waText = encodeURIComponent(
          `*WEDDING RSVP - Constance & Onyekachi (28 Nov 2026)*\n\n` +
          `• *Guest Name:* ${name}\n` +
          `• *Phone:* ${phone || 'N/A'}\n` +
          `• *Status:* ${status}\n` +
          `• *Guests Count:* ${guests}\n` +
          (message ? `• *Well Wishes:* "${message}"\n\n` : `\n`) +
          `Looking forward to celebrating with you!`
        );

        const waUrl = `https://wa.me/2347040182980?text=${waText}`;

        // 6. Open celebratory confirmation modal
        openSuccessModal(payload, waUrl);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;
        }

        rsvpForm.reset();
      });
    }

    // Direct WhatsApp Button
    const directWaBtn = document.getElementById('btn-whatsapp-direct');
    if (directWaBtn) {
      const defaultMsg = encodeURIComponent(
        "Hello Constance & Onyekachi, I received your wedding invitation for 28th Nov 2026! I would like to RSVP and share my congratulations."
      );
      directWaBtn.setAttribute('href', `https://wa.me/2347040182980?text=${defaultMsg}`);
    }

    // Palette Color Swatch Copy to Clipboard
    const paletteCards = document.querySelectorAll('.palette-card');
    paletteCards.forEach(card => {
      card.addEventListener('click', () => {
        const hex = card.getAttribute('data-hex');
        const colorName = card.querySelector('.palette-title').textContent;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(hex).then(() => {
            showToast(`Copied ${colorName} (${hex}) to clipboard!`);
          });
        }
      });
    });

    // Registry Tab Switching (Local vs. International)
    const registryTabs = document.querySelectorAll('.registry-tab-btn');
    const registryPanels = document.querySelectorAll('.registry-panel');

    registryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');

        registryTabs.forEach(t => t.classList.remove('active'));
        registryPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }
      });
    });

    // Registry Account Details Copy to Clipboard
    const copyAccountBtns = document.querySelectorAll('.btn-copy-account');
    copyAccountBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const textToCopy = btn.getAttribute('data-copy');
        const label = btn.getAttribute('data-label') || 'Details';
        const originalHTML = btn.innerHTML;

        if (navigator.clipboard && textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            btn.classList.add('copied');
            btn.innerHTML = `✓ Copied!`;
            showToast(`Copied ${label}: ${textToCopy}`);

            setTimeout(() => {
              btn.classList.remove('copied');
              btn.innerHTML = originalHTML;
              if (window.lucide) window.lucide.createIcons();
            }, 2200);
          }).catch(() => {
            prompt("Copy to clipboard:", textToCopy);
          });
        } else if (textToCopy) {
          prompt("Copy to clipboard:", textToCopy);
        }
      });
    });

    // Simple toast alert
    function showToast(text) {
      let toast = document.getElementById('wedding-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wedding-toast';
        toast.style.cssText = `
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(4, 57, 39, 0.95);
          color: #f7e2a9;
          border: 1px solid #d4af37;
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 9999;
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        `;
        document.body.appendChild(toast);
      }
      toast.textContent = text;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
      }, 2500);
    }
  });

})();

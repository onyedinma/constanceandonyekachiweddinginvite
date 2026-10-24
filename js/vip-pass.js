/**
 * PERSONALIZED VIP DIGITAL INVITATION PASS GENERATOR
 * Constance & Onyekachi Wedding
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const inputName = document.getElementById('vip-input-name');
    const selectParty = document.getElementById('vip-select-party');
    const selectCategory = document.getElementById('vip-select-tier');
    const displayGuestName = document.getElementById('ticket-guest-name');
    const displayGuestTier = document.getElementById('ticket-guest-tier');
    const displayGuestParty = document.getElementById('ticket-party-count');
    const displayCode = document.getElementById('ticket-code');
    const downloadBtn = document.getElementById('btn-download-pass');
    const ticketElement = document.querySelector('.vip-ticket');

    // Generate random luxury serial code
    function generateSerial() {
      const rand = Math.floor(1000 + Math.random() * 9000);
      return `CO-2811-${rand}`;
    }

    const currentSerial = generateSerial();
    if (displayCode) displayCode.textContent = currentSerial;

    // Real-time update
    function updateTicket() {
      const name = inputName && inputName.value.trim() ? inputName.value.trim() : "Honored Guest";
      const party = selectParty ? selectParty.value : "Admit 1";
      const category = selectCategory ? selectCategory.value : "VIP Gold Access";

      if (displayGuestName) displayGuestName.textContent = name;
      if (displayGuestTier) displayGuestTier.textContent = `${category} • ${party}`;
      if (displayGuestParty) displayGuestParty.textContent = party;
    }

    if (inputName) inputName.addEventListener('input', updateTicket);
    if (selectParty) selectParty.addEventListener('change', updateTicket);
    if (selectCategory) selectCategory.addEventListener('change', updateTicket);

    // 3D Tilt on Ticket
    if (ticketElement) {
      ticketElement.addEventListener('mousemove', (e) => {
        const rect = ticketElement.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 12;

        ticketElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      ticketElement.addEventListener('mouseleave', () => {
        ticketElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }

    // High Resolution Canvas Pass Generator for Download
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const guestName = inputName && inputName.value.trim() ? inputName.value.trim() : "Honored Guest";
        const partyText = selectParty ? selectParty.options[selectParty.selectedIndex].text : "Admit 1";
        const tierText = selectCategory ? selectCategory.options[selectCategory.selectedIndex].text : "VIP Gold Access";

        // Render to high-res canvas (1200 x 750)
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 750;
        const ctx = canvas.getContext('2d');

        // Background Gradient (Royal Emerald & Deep Forest)
        const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750);
        bgGrad.addColorStop(0, '#053e2a');
        bgGrad.addColorStop(0.5, '#032a1c');
        bgGrad.addColorStop(1, '#01170f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1200, 750);

        // Ornate Gold Outer Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(30, 30, 1140, 690);

        ctx.strokeStyle = '#e5c378';
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 45, 1110, 660);

        // Header Title
        ctx.fillStyle = '#e5c378';
        ctx.font = 'bold 26px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '4px';
        ctx.fillText('SOLEMNIZATION OF HOLY MATRIMONY', 600, 100);

        // Couple Script Names
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 58px "Cormorant Garamond", serif';
        ctx.fillText('Constance Onyinyechi & Onyekachi', 600, 175);

        // Gold divider line
        const divGrad = ctx.createLinearGradient(400, 205, 800, 205);
        divGrad.addColorStop(0, 'transparent');
        divGrad.addColorStop(0.5, '#d4af37');
        divGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(350, 205);
        ctx.lineTo(850, 205);
        ctx.stroke();

        // VIP Badge
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(450, 230, 300, 40);
        ctx.fillStyle = '#042b1d';
        ctx.font = 'bold 18px Montserrat, sans-serif';
        ctx.fillText(tierText.toUpperCase(), 600, 257);

        // Guest Name
        ctx.fillStyle = '#fce2a6';
        ctx.font = 'bold 44px "Cormorant Garamond", serif';
        ctx.fillText(guestName, 600, 340);

        ctx.fillStyle = '#cfdfd7';
        ctx.font = '20px Montserrat, sans-serif';
        ctx.fillText(`Pass Valid For: ${partyText}`, 600, 385);

        // Event Schedule Box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(150, 425, 900, 170);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(150, 425, 900, 170);

        ctx.fillStyle = '#e5c378';
        ctx.font = 'bold 22px Montserrat, sans-serif';
        ctx.fillText('SATURDAY, 28TH NOVEMBER 2026 | 10:00 AM', 600, 470);

        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Montserrat, sans-serif';
        ctx.fillText('Church: St. Marks Anglican Church, Old Aba Road, Oyigbo', 600, 515);
        ctx.fillText('Reception: Limewood Hotel Royale, Plot F6 Abacha Road, GRA Phase 3, Port Harcourt', 600, 555);

        // Footer & Serial
        ctx.fillStyle = '#d4af37';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SERIAL: ${currentSerial}`, 70, 670);

        ctx.textAlign = 'right';
        ctx.fillText('RSVP: 07040182980', 1130, 670);

        // Download PNG
        const link = document.createElement('a');
        link.download = `VIP_Pass_${guestName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  });
})();

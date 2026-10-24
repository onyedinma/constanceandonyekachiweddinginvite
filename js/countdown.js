/**
 * COUNTDOWN TIMER & CALENDAR EVENT GENERATOR
 * Target: Saturday, 28th November 2026, 10:00 AM (WAT / UTC+1)
 */

(function () {
  'use strict';

  // Wedding Date: Nov 28, 2026, 10:00:00 GMT+0100
  const TARGET_DATE = new Date('2026-11-28T10:00:00+01:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  // 1. Google Calendar Link
  function setupGoogleCalendar() {
    const btn = document.getElementById('btn-google-calendar');
    if (!btn) return;

    const title = encodeURIComponent("Solemnization of Holy Matrimony: Constance & Onyekachi");
    const details = encodeURIComponent(
      "The Families of Late Rev. & Mrs. David Nwogwugwu and Pastor & Mrs Maurice Onyedinma cordially invite you to the Solemnization of Holy Matrimony of Constance Onyinyechi David & Onyekachi Onyedinma.\n\n" +
      "Church Ceremony: St. Marks Anglican Church, No. 283 Old Aba Road, before FCMB, Oyigbo, Rivers State (10:00 AM)\n" +
      "Reception: Limewood Hotel Royale, Plot F6 Abacha Road, GRA Phase 3, Port Harcourt\n\n" +
      "Colours: Emerald Green, Champagne Gold, Burnt Orange, Burgundy\nRSVP: 07040182980"
    );
    const location = encodeURIComponent("St. Marks Anglican Church, No. 283 Old Aba Road, before FCMB, Oyigbo, Rivers State");
    const dates = "20261128T090000Z/20261128T170000Z";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    btn.setAttribute('href', gcalUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  }

  // 2. ICS File Generator for Apple Calendar / Outlook
  function setupIcsDownload() {
    const btn = document.getElementById('btn-download-ics');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Constance and Onyekachi Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:wedding-constance-onyekachi-20261128@ceremony",
        "DTSTAMP:20261024T100000Z",
        "DTSTART:20261128T090000Z",
        "DTEND:20261128T170000Z",
        "SUMMARY:Solemnization of Holy Matrimony: Constance & Onyekachi",
        "DESCRIPTION:Solemnization of Holy Matrimony of Constance Onyinyechi David & Onyekachi Onyedinma.\\n\\nCeremony: St. Marks Anglican Church\\, No. 283 Old Aba Road\\, before FCMB\\, Oyigbo\\, Rivers State (10:00 AM)\\nReception follows immediately @ Limewood Hotel Royale\\, Plot F6 Abacha Road\\, GRA Phase 3 Port Harcourt.\\n\\nColours: Emerald Green\\, Champagne Gold\\, Burnt Orange\\, Burgundy.\\nRSVP: 07040182980",
        "LOCATION:St. Marks Anglican Church, No. 283 Old Aba Road, before FCMB, Oyigbo, Rivers State",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute("download", "Constance_and_Onyekachi_Wedding.ics");
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    setupGoogleCalendar();
    setupIcsDownload();
  });

})();

# 💍 Constance & Onyekachi — 3D Royal Wedding Invitation Website

A luxury 3D interactive wedding website created for the **Solemnization of Holy Matrimony** of **Constance Onyinyechi David** & **Onyekachi Onyedinma**.

---

## ✨ Features & Experiences

1. **3D Interactive Opening Ceremony (Wax-Sealed Envelope)**
   - 3D Emerald & Gold envelope with realistic 3D gyroscopic tilt and mouse physics.
   - Interactive embossed gold wax seal monogrammed **"C & O"**.
   - Tap to unseal with a particle blast of champagne gold & emerald confetti and acoustic harp chimes!

2. **3D Interlocking Wedding Rings Studio**
   - Real-time Three.js WebGL exhibit featuring Constance's solitaire diamond engagement ring and Onyekachi's royal comfort-fit band.
   - 360° drag-to-orbit rotation and touch gestures.
   - Dynamic lighting presets: *Champagne Gold*, *Rose Gold*, *Candlelit Romance*, and *Royal Emerald*.
   - Faceted diamond refraction shaders (IOR 2.417) with specular glints.

3. **Background 3D Particles & Floating Botanical Petals**
   - Floating champagne gold dust motes and drifting white floral petals that react gracefully to mouse parallax.

4. **Live Countdown & Smart Calendar Integration**
   - Real-time countdown to **Saturday, 28th November 2026 at 10:00 AM WAT**.
   - One-click **Add to Google Calendar** with full event details pre-filled.
   - One-click **Download .ICS Calendar File** for Apple Calendar, Outlook, and mobile devices.

5. **Wedding Venues & Maps**
   - **Ceremony**: St. Marks Anglican Church, No. 283 Old Aba Road, before FCMB, Oyigbo, Rivers State (10:00 AM).
   - **Reception**: Limewood Hotel Royale, Plot F6 Abacha Road, GRA Phase 3, Port Harcourt (Follows Immediately).
   - Direct Google Maps routing buttons for both locations.

6. **Colours of the Day Interactive Palette**
   - **Emerald Green** (`#094D36`)
   - **Champagne Gold** (`#E5C378`)
   - **Burnt Orange** (`#C05820`)
   - **Burgundy** (`#6B1426`)
   - 1-click copy hex codes with toast confirmation.

7. **Bless the Couple (Wedding Registry & Financial Gifts)**
   - **Local Transfers (Nigeria)**:
     - First Bank: `3149336090` (David Constance Onyinyechi)
     - GTBank: `0730369478` (Onyekachi Onyedinma)
   - **International Wire Transfer**:
     - Guaranty Trust Bank PLC, Lagos Nigeria
     - Beneficiary: `ONYEDINMA ONYEKACHI` | A/C: `0730369492`
     - SWIFT Code: `GTBINGLA` | Sort Code: `058-215025`
   - Interactive 1-click **"Copy Account Number"** with visual checkmark feedback and toast notification.
   - **Guest Logistics & Concierge Support Bar**: Hotel reservations for Limewood Hotel Royale, airport guidance for Port Harcourt (Omagwa - PHC), and direct support line (`07040182980`).

8. **Personalized VIP Pass Generator**
   - Guests can enter their name and party size to generate a bespoke golden VIP boarding pass.
   - Includes real-time 3D card tilt, QR code verification, and a **"Download VIP Pass"** button (renders a high-resolution 1200x750 PNG for WhatsApp statuses and mobile phones).

9. **Direct WhatsApp RSVP & Interactive Guestbook Wall**
   - Direct WhatsApp button to **07040182980** with pre-formatted message.
   - Direct Phone Call button.
   - Digital RSVP form with persistent local storage and live celebration wishes board.

10. **Ambient Classical Wedding Music**
   - Floating audio widget with animated equalizer bars.
   - Built-in Web Audio API romantic harp/chimes arpeggiator (zero external file dependencies required).

---

## 🚀 How to Run Locally

### Option 1: Via Node.js (Recommended)
```bash
npm start
```
Then open your browser at:
```
http://localhost:3000
```

### Option 2: Via Python
```bash
python -m http.server 3000
```

### Option 3: Direct File Open
You can also open [index.html](file:///c:/Users/onyed/Documents/Coding/wedding/index.html) directly in any modern web browser (Chrome, Edge, Safari, Firefox).

---

## 📂 Project Structure
```
wedding/
├── assets/
│   └── original-invitation.jpg    # Scanned high-resolution invitation card
├── css/
│   └── style.css                  # Royal emerald, gold foil & 3D styling
├── js/
│   ├── audio.js                   # Web Audio romantic harp/chime synthesizer
│   ├── countdown.js               # Live countdown & calendar exporter (.ics / Google)
│   ├── envelope.js                # 3D envelope unsealing & tilt engine
│   ├── main.js                    # UI interactions, modal lightbox, scroll reveals
│   ├── rsvp.js                    # WhatsApp dispatch, RSVP form, guestbook wall
│   ├── three-scene.js             # Three.js 3D background & rings studio
│   └── vip-pass.js                # Canvas VIP pass generator & PNG downloader
├── index.html                     # Main wedding portal
├── package.json                   # Project metadata & npm scripts
├── server.js                      # Zero-dependency local Node server
└── README.md                      # Documentation & deployment guide
```

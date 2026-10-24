const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const RSVPS_FILE = path.join(DATA_DIR, 'rsvps.json');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RSVPS_FILE)) fs.writeFileSync(RSVPS_FILE, '[]', 'utf8');
if (!fs.existsSync(WISHES_FILE)) fs.writeFileSync(WISHES_FILE, '[]', 'utf8');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8'
};

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = decodeURI(urlParts[0]);

  // CORS Headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // =========================================================================
  // REST API ENDPOINTS
  // =========================================================================

  // 1. GET /api/wishes - Fetch public guestbook wishes
  if (req.method === 'GET' && reqPath === '/api/wishes') {
    try {
      const data = fs.readFileSync(WISHES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to load wishes' }));
    }
    return;
  }

  // 2. POST /api/rsvp - Submit real RSVP and share wish
  if (req.method === 'POST' && reqPath === '/api/rsvp') {
    try {
      const body = await parseJsonBody(req);
      const name = (body.name || '').trim();
      const phone = (body.phone || '').trim();
      const status = (body.status || 'Joyfully Attending').trim();
      const guests = (body.guests || '1 Guest').trim();
      const message = (body.message || '').trim();

      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Name is required' }));
        return;
      }

      const timestamp = new Date().toISOString();
      const rsvpEntry = {
        id: 'rsvp-' + Date.now(),
        name,
        phone,
        status,
        guests,
        message,
        timestamp
      };

      // 1. Save to RSVPs database
      let rsvps = [];
      try {
        rsvps = JSON.parse(fs.readFileSync(RSVPS_FILE, 'utf8') || '[]');
      } catch (e) {
        rsvps = [];
      }
      rsvps.unshift(rsvpEntry);
      fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), 'utf8');

      // 2. If a message is provided, save to live Wishes database
      let wishEntry = null;
      if (message) {
        let wishes = [];
        try {
          wishes = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf8') || '[]');
        } catch (e) {
          wishes = [];
        }
        wishEntry = {
          id: 'wish-' + Date.now(),
          author: name,
          text: message,
          time: 'Just now',
          createdAt: timestamp
        };
        wishes.unshift(wishEntry);
        fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf8');
      }

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'RSVP recorded successfully in database',
        rsvp: rsvpEntry,
        wish: wishEntry
      }));
    } catch (err) {
      console.error('Error saving RSVP:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error processing RSVP' }));
    }
    return;
  }

  // 3. GET /api/rsvps - View all RSVPs in JSON
  if (req.method === 'GET' && reqPath === '/api/rsvps') {
    try {
      const data = fs.readFileSync(RSVPS_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to load RSVPs' }));
    }
    return;
  }

  // 4. GET /api/export-csv - Download clean Excel CSV spreadsheet of guest list
  if (req.method === 'GET' && reqPath === '/api/export-csv') {
    try {
      const rsvps = JSON.parse(fs.readFileSync(RSVPS_FILE, 'utf8') || '[]');
      let csv = 'Timestamp,Guest Name,Phone Number,Attendance Status,Guests Count,Well Wishes\r\n';
      rsvps.forEach(r => {
        const row = [
          `"${(r.timestamp || '').replace(/"/g, '""')}"`,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.phone || '').replace(/"/g, '""')}"`,
          `"${(r.status || '').replace(/"/g, '""')}"`,
          `"${(r.guests || '').replace(/"/g, '""')}"`,
          `"${(r.message || '').replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\r\n';
      });

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Constance_Onyekachi_Wedding_RSVPs.csv"'
      });
      res.end(csv);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to generate CSV');
    }
    return;
  }

  // =========================================================================
  // STATIC FILE SERVING
  // =========================================================================
  let staticPath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(PUBLIC_DIR, staticPath);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p><a href="/">Return to Constance & Onyekachi Wedding</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ CONSTANCE & ONYEKACHI WEDDING 3D WEBSITE RUNNING ✨`);
  console.log(`💍 Local URL: http://localhost:${PORT}`);
  console.log(`📋 RSVP API: POST http://localhost:${PORT}/api/rsvp`);
  console.log(`📊 Export Guest List: http://localhost:${PORT}/api/export-csv`);
  console.log(`=======================================================`);
});

const { getStore } = require("@netlify/blobs");

function formatTimeAgo(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? "s" : ""} ago`;
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const status = (body.status || "Joyfully Attending").trim();
    const guests = (body.guests || "1 Guest").trim();
    const message = (body.message || "").trim();

    if (!name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Name is required" }) };
    }

    const timestamp = new Date().toISOString();
    const store = getStore("wedding-data");

    // 1. Save RSVP entry
    const rsvpEntry = {
      id: "rsvp-" + Date.now(),
      name,
      phone,
      status,
      guests,
      message,
      timestamp
    };

    let rsvps = [];
    try {
      const existing = await store.get("rsvps", { type: "json" });
      if (Array.isArray(existing)) rsvps = existing;
    } catch (e) {}
    rsvps.unshift(rsvpEntry);
    await store.setJSON("rsvps", rsvps);

    // 2. If a message/prayer was shared, add to wishes wall
    let wishEntry = null;
    if (message) {
      let wishes = [];
      try {
        const existing = await store.get("wishes", { type: "json" });
        if (Array.isArray(existing)) wishes = existing;
      } catch (e) {}

      wishEntry = {
        id: "wish-" + Date.now(),
        author: name,
        text: message,
        time: formatTimeAgo(timestamp),
        createdAt: timestamp
      };
      wishes.unshift(wishEntry);
      await store.setJSON("wishes", wishes);
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: "RSVP recorded successfully",
        rsvp: rsvpEntry,
        wish: wishEntry
      })
    };
  } catch (err) {
    console.error("Error saving RSVP:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error processing RSVP" })
    };
  }
};

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*" }, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const store = getStore("wedding-data");
    let rsvps = [];
    try {
      const existing = await store.get("rsvps", { type: "json" });
      if (Array.isArray(existing)) rsvps = existing;
    } catch (e) {}

    let csv = "Timestamp,Guest Name,Phone Number,Attendance Status,Guests Count,Well Wishes\r\n";
    rsvps.forEach((r) => {
      const row = [
        `"${(r.timestamp || "").replace(/"/g, '""')}"`,
        `"${(r.name || "").replace(/"/g, '""')}"`,
        `"${(r.phone || "").replace(/"/g, '""')}"`,
        `"${(r.status || "").replace(/"/g, '""')}"`,
        `"${(r.guests || "").replace(/"/g, '""')}"`,
        `"${(r.message || "").replace(/"/g, '""')}"`
      ];
      csv += row.join(",") + "\r\n";
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Constance_Onyekachi_Wedding_RSVPs.csv"'
      },
      body: csv
    };
  } catch (err) {
    return { statusCode: 500, body: "Failed to generate CSV" };
  }
};

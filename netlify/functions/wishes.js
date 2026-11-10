const { getStore } = require("@netlify/blobs");

const DEFAULT_WISHES = [
  {
    id: "wish-1",
    author: "Elder & Deaconess Amadi",
    text: "May the almighty Lord establish your home in everlasting peace, divine favor, and overflowing fruitfulness! Congratulations Constance and Onyekachi!",
    time: "2 hours ago",
    createdAt: "2026-10-24T09:30:00Z"
  },
  {
    id: "wish-2",
    author: "Engr. Maurice Jr. & Family",
    text: "A match ordained from heaven. Songs of Solomon 3:4 is fulfilled in your lives. We cannot wait to celebrate with you both in Port Harcourt!",
    time: "Yesterday",
    createdAt: "2026-10-23T14:15:00Z"
  },
  {
    id: "wish-3",
    author: "Dr. Chioma N.",
    text: "So thrilled for my dearest Constance! You are going to make the most angelic bride. God bless your new union richly!",
    time: "2 days ago",
    createdAt: "2026-10-22T18:00:00Z"
  },
  {
    id: "wish-4",
    author: "Barrister & Mrs. E. Eze",
    text: "Warmest congratulations to the David & Onyedinma families. Wishing you joy that knows no bounds as two become one flesh.",
    time: "3 days ago",
    createdAt: "2026-10-21T11:45:00Z"
  }
];

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const store = getStore("wedding-data");
    const raw = await store.get("wishes", { type: "json" });

    if (raw && Array.isArray(raw) && raw.length > 0) {
      return { statusCode: 200, headers, body: JSON.stringify(raw) };
    }

    // First run: seed with defaults and return them
    await store.setJSON("wishes", DEFAULT_WISHES);
    return { statusCode: 200, headers, body: JSON.stringify(DEFAULT_WISHES) };
  } catch (err) {
    console.error("Error fetching wishes:", err);
    // Fallback to defaults if blob store fails
    return { statusCode: 200, headers, body: JSON.stringify(DEFAULT_WISHES) };
  }
};

const db = require("../../config/db");

async function listHomeStats(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM home_stats ORDER BY sort_order ASC, id ASC"
    );

    return res.json({ stats: rows });
  } catch (error) {
    console.error("Error fetching home_stats:", error.message);
    return res.status(500).json({ error: "Failed to fetch home stats" });
  }
}

module.exports = {
  listHomeStats,
};


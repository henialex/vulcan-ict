const db = require("../../config/db");

async function listAiFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM ai_features ORDER BY sort_order ASC, id ASC"
    );

    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching ai_features:", error.message);
    return res.status(500).json({ error: "Failed to fetch AI features" });
  }
}

module.exports = {
  listAiFeatures,
};


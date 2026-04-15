const db = require("../../config/db");

async function listAboutFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM about_features ORDER BY sort_order ASC, id ASC"
    );

    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching about_features:", error.message);
    return res.status(500).json({ error: "Failed to fetch about features" });
  }
}

module.exports = {
  listAboutFeatures,
};


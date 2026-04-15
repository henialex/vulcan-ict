const db = require("../../config/db");

async function listHomeWhyItems(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM home_why_items ORDER BY sort_order ASC, id ASC"
    );

    return res.json({ items: rows });
  } catch (error) {
    console.error("Error fetching home_why_items:", error.message);
    return res.status(500).json({ error: "Failed to fetch home why items" });
  }
}

module.exports = {
  listHomeWhyItems,
};


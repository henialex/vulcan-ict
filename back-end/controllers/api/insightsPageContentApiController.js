const db = require("../../config/db");

async function getInsightsPageContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM insights_page_content ORDER BY id DESC LIMIT 1"
    );

    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching insights_page_content:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch insights page content" });
  }
}

module.exports = {
  getInsightsPageContent,
};


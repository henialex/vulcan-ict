const db = require("../../config/db");

async function getAboutContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM about_content ORDER BY id DESC LIMIT 1"
    );

    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching about_content:", error.message);
    return res.status(500).json({ error: "Failed to fetch about content" });
  }
}

module.exports = {
  getAboutContent,
};


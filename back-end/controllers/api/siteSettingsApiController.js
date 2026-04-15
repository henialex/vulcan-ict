const db = require("../../config/db");

const getSiteSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1");
    const settings = rows && rows.length > 0 ? rows[0] : null;
    res.set("Cache-Control", "no-store");
    res.json({ settings });
  } catch (error) {
    console.error("Error fetching site settings:", error.message);
    res.status(500).json({ error: "Error fetching site settings" });
  }
};

module.exports = {
  getSiteSettings,
};


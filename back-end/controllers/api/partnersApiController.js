const db = require("../../config/db");

const listPartners = async (req, res) => {
  try {
    const [partners] = await db.query(`
      SELECT id, name, partner_type, description, logo_image, icon_class, sort_order
      FROM partners
      ORDER BY sort_order ASC, id ASC
    `);

    res.set("Cache-Control", "no-store");
    res.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error.message);
    res.status(500).json({ error: "Error fetching partners" });
  }
};

module.exports = {
  listPartners,
};


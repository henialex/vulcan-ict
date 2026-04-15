const db = require("../../config/db");

async function listServiceProcessFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      `
      SELECT
        f.id,
        f.process_step_id,
        f.feature_text,
        f.sort_order
      FROM service_process_features f
      ORDER BY f.process_step_id ASC, f.sort_order ASC, f.id ASC
      `
    );

    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching service_process_features:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch service process features" });
  }
}

module.exports = {
  listServiceProcessFeatures,
};


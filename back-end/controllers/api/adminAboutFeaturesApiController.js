const db = require("../../config/db");

async function listAdminAboutFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM about_features ORDER BY sort_order ASC, id ASC"
    );
    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching admin about_features:", error.message);
    return res.status(500).json({ error: "Error fetching about features" });
  }
}

async function getAdminAboutFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query("SELECT * FROM about_features WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ feature: rows[0] });
  } catch (error) {
    console.error("Error fetching admin about_feature:", error.message);
    return res.status(500).json({ error: "Error fetching about feature" });
  }
}

async function createAdminAboutFeature(req, res) {
  try {
    const { feature_text, icon_class, sort_order } = req.body || {};
    if (!feature_text) return res.status(400).json({ error: "feature_text is required" });

    const [result] = await db.query(
      "INSERT INTO about_features (feature_text, icon_class, sort_order) VALUES (?, ?, ?)",
      [
        feature_text,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating about_feature:", error.message);
    return res.status(500).json({ error: "Error creating about feature" });
  }
}

async function updateAdminAboutFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { feature_text, icon_class, sort_order } = req.body || {};
    if (!feature_text) return res.status(400).json({ error: "feature_text is required" });

    const [exists] = await db.query("SELECT id FROM about_features WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE about_features SET feature_text = ?, icon_class = ?, sort_order = ? WHERE id = ?",
      [
        feature_text,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        id,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating about_feature:", error.message);
    return res.status(500).json({ error: "Error updating about feature" });
  }
}

async function deleteAdminAboutFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query("SELECT id FROM about_features WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM about_features WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting about_feature:", error.message);
    return res.status(500).json({ error: "Error deleting about feature" });
  }
}

module.exports = {
  listAdminAboutFeatures,
  getAdminAboutFeature,
  createAdminAboutFeature,
  updateAdminAboutFeature,
  deleteAdminAboutFeature,
};


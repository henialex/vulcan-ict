const db = require("../../config/db");

async function listAdminAiFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM ai_features ORDER BY sort_order ASC, id ASC"
    );
    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching admin ai_features:", error.message);
    return res.status(500).json({ error: "Error fetching AI features" });
  }
}

async function getAdminAiFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query("SELECT * FROM ai_features WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ feature: rows[0] });
  } catch (error) {
    console.error("Error fetching admin ai_feature:", error.message);
    return res.status(500).json({ error: "Error fetching AI feature" });
  }
}

async function createAdminAiFeature(req, res) {
  try {
    const { title, description, image, sort_order } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const [result] = await db.query(
      "INSERT INTO ai_features (title, description, image, sort_order) VALUES (?, ?, ?, ?)",
      [
        title,
        description || null,
        image || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating ai_feature:", error.message);
    return res.status(500).json({ error: "Error creating AI feature" });
  }
}

async function updateAdminAiFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, description, image, sort_order } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const [exists] = await db.query("SELECT id FROM ai_features WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE ai_features SET title = ?, description = ?, image = ?, sort_order = ? WHERE id = ?",
      [
        title,
        description || null,
        image || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        id,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating ai_feature:", error.message);
    return res.status(500).json({ error: "Error updating AI feature" });
  }
}

async function deleteAdminAiFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query("SELECT id FROM ai_features WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM ai_features WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting ai_feature:", error.message);
    return res.status(500).json({ error: "Error deleting AI feature" });
  }
}

module.exports = {
  listAdminAiFeatures,
  getAdminAiFeature,
  createAdminAiFeature,
  updateAdminAiFeature,
  deleteAdminAiFeature,
};


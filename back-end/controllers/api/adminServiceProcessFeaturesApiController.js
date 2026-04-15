const db = require("../../config/db");

async function listAdminServiceProcessFeatures(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM service_process_features ORDER BY process_step_id ASC, sort_order ASC, id ASC"
    );
    return res.json({ features: rows });
  } catch (error) {
    console.error("Error fetching admin service_process_features:", error.message);
    return res
      .status(500)
      .json({ error: "Error fetching service process features" });
  }
}

async function getAdminServiceProcessFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query(
      "SELECT * FROM service_process_features WHERE id = ?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ feature: rows[0] });
  } catch (error) {
    console.error("Error fetching admin service_process_feature:", error.message);
    return res.status(500).json({ error: "Error fetching service process feature" });
  }
}

async function createAdminServiceProcessFeature(req, res) {
  try {
    const { process_step_id, feature_text, sort_order } = req.body || {};
    const stepId = Number(process_step_id);
    if (!Number.isFinite(stepId)) {
      return res.status(400).json({ error: "process_step_id is required" });
    }
    if (!feature_text) {
      return res.status(400).json({ error: "feature_text is required" });
    }

    const [step] = await db.query("SELECT id FROM service_process_steps WHERE id = ?", [
      stepId,
    ]);
    if (!step.length) return res.status(400).json({ error: "Invalid process_step_id" });

    const [result] = await db.query(
      "INSERT INTO service_process_features (process_step_id, feature_text, sort_order) VALUES (?, ?, ?)",
      [
        stepId,
        feature_text,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating service_process_feature:", error.message);
    return res
      .status(500)
      .json({ error: "Error creating service process feature" });
  }
}

async function updateAdminServiceProcessFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { process_step_id, feature_text, sort_order } = req.body || {};
    const stepId = Number(process_step_id);
    if (!Number.isFinite(stepId)) {
      return res.status(400).json({ error: "process_step_id is required" });
    }
    if (!feature_text) {
      return res.status(400).json({ error: "feature_text is required" });
    }

    const [exists] = await db.query(
      "SELECT id FROM service_process_features WHERE id = ?",
      [id]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    const [step] = await db.query("SELECT id FROM service_process_steps WHERE id = ?", [
      stepId,
    ]);
    if (!step.length) return res.status(400).json({ error: "Invalid process_step_id" });

    await db.query(
      "UPDATE service_process_features SET process_step_id = ?, feature_text = ?, sort_order = ? WHERE id = ?",
      [
        stepId,
        feature_text,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        id,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating service_process_feature:", error.message);
    return res
      .status(500)
      .json({ error: "Error updating service process feature" });
  }
}

async function deleteAdminServiceProcessFeature(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query(
      "SELECT id FROM service_process_features WHERE id = ?",
      [id]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM service_process_features WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting service_process_feature:", error.message);
    return res
      .status(500)
      .json({ error: "Error deleting service process feature" });
  }
}

module.exports = {
  listAdminServiceProcessFeatures,
  getAdminServiceProcessFeature,
  createAdminServiceProcessFeature,
  updateAdminServiceProcessFeature,
  deleteAdminServiceProcessFeature,
};


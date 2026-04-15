const db = require("../../config/db");

async function listAdminServiceProcessSteps(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM service_process_steps ORDER BY sort_order ASC, id ASC"
    );
    return res.json({ steps: rows });
  } catch (error) {
    console.error("Error fetching admin service_process_steps:", error.message);
    return res.status(500).json({ error: "Error fetching service process steps" });
  }
}

async function getAdminServiceProcessStep(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query("SELECT * FROM service_process_steps WHERE id = ?", [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ step: rows[0] });
  } catch (error) {
    console.error("Error fetching admin service_process_step:", error.message);
    return res.status(500).json({ error: "Error fetching service process step" });
  }
}

async function createAdminServiceProcessStep(req, res) {
  try {
    const { step_number, title, description, icon_class, sort_order } = req.body || {};
    if (!step_number || !title) {
      return res.status(400).json({ error: "step_number and title are required" });
    }

    const [result] = await db.query(
      "INSERT INTO service_process_steps (step_number, title, description, icon_class, sort_order) VALUES (?, ?, ?, ?, ?)",
      [
        step_number,
        title,
        description || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating service_process_step:", error.message);
    return res.status(500).json({ error: "Error creating service process step" });
  }
}

async function updateAdminServiceProcessStep(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { step_number, title, description, icon_class, sort_order } = req.body || {};
    if (!step_number || !title) {
      return res.status(400).json({ error: "step_number and title are required" });
    }

    const [exists] = await db.query(
      "SELECT id FROM service_process_steps WHERE id = ?",
      [id]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE service_process_steps SET step_number = ?, title = ?, description = ?, icon_class = ?, sort_order = ? WHERE id = ?",
      [
        step_number,
        title,
        description || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        id,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating service_process_step:", error.message);
    return res.status(500).json({ error: "Error updating service process step" });
  }
}

async function deleteAdminServiceProcessStep(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query(
      "SELECT id FROM service_process_steps WHERE id = ?",
      [id]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    // delete dependent features first
    await db.query("DELETE FROM service_process_features WHERE process_step_id = ?", [
      id,
    ]);
    await db.query("DELETE FROM service_process_steps WHERE id = ?", [id]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting service_process_step:", error.message);
    return res.status(500).json({ error: "Error deleting service process step" });
  }
}

module.exports = {
  listAdminServiceProcessSteps,
  getAdminServiceProcessStep,
  createAdminServiceProcessStep,
  updateAdminServiceProcessStep,
  deleteAdminServiceProcessStep,
};


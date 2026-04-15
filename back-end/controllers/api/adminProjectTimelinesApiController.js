const db = require("../../config/db");

async function listAdminProjectTimelines(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const projectId = Number(req.params.projectId);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const [rows] = await db.query(
      "SELECT * FROM project_timelines WHERE project_id = ? ORDER BY sort_order ASC, id ASC",
      [projectId]
    );

    return res.json({ timelines: rows });
  } catch (error) {
    console.error("Error fetching admin project_timelines:", error.message);
    return res.status(500).json({ error: "Error fetching project timelines" });
  }
}

async function createAdminProjectTimeline(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const { title, description, sort_order } = req.body || {};
    const titleTrim = String(title || "").trim();
    if (!titleTrim) return res.status(400).json({ error: "title is required" });

    const [result] = await db.query(
      "INSERT INTO project_timelines (project_id, title, description, sort_order) VALUES (?, ?, ?, ?)",
      [
        projectId,
        titleTrim,
        description == null || description === "" ? null : String(description),
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating project_timeline:", error.message);
    return res.status(500).json({ error: "Error creating project timeline" });
  }
}

async function updateAdminProjectTimeline(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const timelineId = Number(req.params.timelineId);
    if (!Number.isFinite(projectId) || !Number.isFinite(timelineId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { title, description, sort_order } = req.body || {};
    const titleTrim = String(title || "").trim();
    if (!titleTrim) return res.status(400).json({ error: "title is required" });

    const [exists] = await db.query(
      "SELECT id FROM project_timelines WHERE id = ? AND project_id = ?",
      [timelineId, projectId]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE project_timelines SET title = ?, description = ?, sort_order = ? WHERE id = ? AND project_id = ?",
      [
        titleTrim,
        description == null || description === "" ? null : String(description),
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        timelineId,
        projectId,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating project_timeline:", error.message);
    return res.status(500).json({ error: "Error updating project timeline" });
  }
}

async function deleteAdminProjectTimeline(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const timelineId = Number(req.params.timelineId);
    if (!Number.isFinite(projectId) || !Number.isFinite(timelineId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const [exists] = await db.query(
      "SELECT id FROM project_timelines WHERE id = ? AND project_id = ?",
      [timelineId, projectId]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "DELETE FROM project_timelines WHERE id = ? AND project_id = ?",
      [timelineId, projectId]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting project_timeline:", error.message);
    return res.status(500).json({ error: "Error deleting project timeline" });
  }
}

module.exports = {
  listAdminProjectTimelines,
  createAdminProjectTimeline,
  updateAdminProjectTimeline,
  deleteAdminProjectTimeline,
};


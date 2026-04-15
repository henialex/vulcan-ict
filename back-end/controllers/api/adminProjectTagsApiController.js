const db = require("../../config/db");

async function listAdminProjectTags(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const projectId = Number(req.params.projectId);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const [rows] = await db.query(
      "SELECT * FROM project_tags WHERE project_id = ? ORDER BY sort_order ASC, id ASC",
      [projectId]
    );

    return res.json({ tags: rows });
  } catch (error) {
    console.error("Error fetching admin project_tags:", error.message);
    return res.status(500).json({ error: "Error fetching project tags" });
  }
}

async function createAdminProjectTag(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const { label, icon_class, sort_order } = req.body || {};
    if (!label) return res.status(400).json({ error: "label is required" });

    const [result] = await db.query(
      "INSERT INTO project_tags (project_id, label, icon_class, sort_order) VALUES (?, ?, ?, ?)",
      [
        projectId,
        label,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating project_tag:", error.message);
    return res.status(500).json({ error: "Error creating project tag" });
  }
}

async function updateAdminProjectTag(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const tagId = Number(req.params.tagId);
    if (!Number.isFinite(projectId) || !Number.isFinite(tagId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { label, icon_class, sort_order } = req.body || {};
    if (!label) return res.status(400).json({ error: "label is required" });

    const [exists] = await db.query(
      "SELECT id FROM project_tags WHERE id = ? AND project_id = ?",
      [tagId, projectId]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE project_tags SET label = ?, icon_class = ?, sort_order = ? WHERE id = ? AND project_id = ?",
      [
        label,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        tagId,
        projectId,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating project_tag:", error.message);
    return res.status(500).json({ error: "Error updating project tag" });
  }
}

async function deleteAdminProjectTag(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const tagId = Number(req.params.tagId);
    if (!Number.isFinite(projectId) || !Number.isFinite(tagId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const [exists] = await db.query(
      "SELECT id FROM project_tags WHERE id = ? AND project_id = ?",
      [tagId, projectId]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM project_tags WHERE id = ? AND project_id = ?", [
      tagId,
      projectId,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting project_tag:", error.message);
    return res.status(500).json({ error: "Error deleting project tag" });
  }
}

module.exports = {
  listAdminProjectTags,
  createAdminProjectTag,
  updateAdminProjectTag,
  deleteAdminProjectTag,
};


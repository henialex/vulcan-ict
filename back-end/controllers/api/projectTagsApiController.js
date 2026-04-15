const db = require("../../config/db");

async function listProjectTags(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const projectId = Number(req.params.id);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const [rows] = await db.query(
      "SELECT * FROM project_tags WHERE project_id = ? ORDER BY sort_order ASC, id ASC",
      [projectId]
    );

    return res.json({ tags: rows });
  } catch (error) {
    console.error("Error fetching project_tags:", error.message);
    return res.status(500).json({ error: "Failed to fetch project tags" });
  }
}

module.exports = {
  listProjectTags,
};


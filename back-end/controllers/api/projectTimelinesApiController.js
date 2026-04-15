const db = require("../../config/db");

async function listProjectTimelines(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const projectId = Number(req.params.id);
    if (!Number.isFinite(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const [rows] = await db.query(
      "SELECT * FROM project_timelines WHERE project_id = ? ORDER BY sort_order ASC, id ASC",
      [projectId]
    );

    return res.json({ timelines: rows });
  } catch (error) {
    console.error("Error fetching project_timelines:", error.message);
    return res.status(500).json({ error: "Failed to fetch project timelines" });
  }
}

module.exports = {
  listProjectTimelines,
};


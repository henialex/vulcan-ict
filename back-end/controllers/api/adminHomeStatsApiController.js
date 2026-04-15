const db = require("../../config/db");

async function listAdminHomeStats(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM home_stats ORDER BY sort_order ASC, id ASC"
    );
    return res.json({ stats: rows });
  } catch (error) {
    console.error("Error fetching admin home_stats:", error.message);
    return res.status(500).json({ error: "Error fetching home stats" });
  }
}

async function getAdminHomeStat(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query("SELECT * FROM home_stats WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ stat: rows[0] });
  } catch (error) {
    console.error("Error fetching admin home_stat:", error.message);
    return res.status(500).json({ error: "Error fetching home stat" });
  }
}

async function createAdminHomeStat(req, res) {
  try {
    const { stat_number, stat_label, sort_order } = req.body || {};
    if (!stat_number || !stat_label) {
      return res
        .status(400)
        .json({ error: "stat_number and stat_label are required" });
    }

    const [result] = await db.query(
      "INSERT INTO home_stats (stat_number, stat_label, sort_order) VALUES (?, ?, ?)",
      [stat_number, stat_label, Number.isFinite(Number(sort_order)) ? Number(sort_order) : null]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating home_stat:", error.message);
    return res.status(500).json({ error: "Error creating home stat" });
  }
}

async function updateAdminHomeStat(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { stat_number, stat_label, sort_order } = req.body || {};
    if (!stat_number || !stat_label) {
      return res
        .status(400)
        .json({ error: "stat_number and stat_label are required" });
    }

    const [exists] = await db.query("SELECT id FROM home_stats WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE home_stats SET stat_number = ?, stat_label = ?, sort_order = ? WHERE id = ?",
      [stat_number, stat_label, Number.isFinite(Number(sort_order)) ? Number(sort_order) : null, id]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating home_stat:", error.message);
    return res.status(500).json({ error: "Error updating home stat" });
  }
}

async function deleteAdminHomeStat(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query("SELECT id FROM home_stats WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM home_stats WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting home_stat:", error.message);
    return res.status(500).json({ error: "Error deleting home stat" });
  }
}

module.exports = {
  listAdminHomeStats,
  getAdminHomeStat,
  createAdminHomeStat,
  updateAdminHomeStat,
  deleteAdminHomeStat,
};


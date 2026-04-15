const db = require("../../config/db");

async function listServiceProcessSteps(req, res) {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await db.query(
      "SELECT * FROM service_process_steps ORDER BY sort_order ASC, id ASC"
    );

    return res.json({ steps: rows });
  } catch (error) {
    console.error("Error fetching service_process_steps:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch service process steps" });
  }
}

module.exports = {
  listServiceProcessSteps,
};


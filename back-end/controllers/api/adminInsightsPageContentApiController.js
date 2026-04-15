const db = require("../../config/db");

async function getAdminInsightsPageContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM insights_page_content ORDER BY id DESC LIMIT 1"
    );
    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching admin insights_page_content:", error.message);
    return res
      .status(500)
      .json({ error: "Error fetching insights page content" });
  }
}

async function createAdminInsightsPageContent(req, res) {
  try {
    const b = req.body || {};
    if (!b.banner_title) {
      return res.status(400).json({ error: "banner_title is required" });
    }

    const query = `
      INSERT INTO insights_page_content
      (banner_title, eyebrow_text, intro_title, intro_description, helper_box_title, helper_box_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      b.banner_title,
      b.eyebrow_text || null,
      b.intro_title || null,
      b.intro_description || null,
      b.helper_box_title || null,
      b.helper_box_text || null,
    ]);

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating insights_page_content:", error.message);
    return res
      .status(500)
      .json({ error: "Error creating insights page content" });
  }
}

async function updateAdminInsightsPageContent(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const b = req.body || {};
    if (!b.banner_title) {
      return res.status(400).json({ error: "banner_title is required" });
    }

    const [exists] = await db.query(
      "SELECT id FROM insights_page_content WHERE id = ?",
      [id]
    );
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    const query = `
      UPDATE insights_page_content SET
        banner_title = ?,
        eyebrow_text = ?,
        intro_title = ?,
        intro_description = ?,
        helper_box_title = ?,
        helper_box_text = ?
      WHERE id = ?
    `;

    await db.query(query, [
      b.banner_title,
      b.eyebrow_text || null,
      b.intro_title || null,
      b.intro_description || null,
      b.helper_box_title || null,
      b.helper_box_text || null,
      id,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating insights_page_content:", error.message);
    return res
      .status(500)
      .json({ error: "Error updating insights page content" });
  }
}

module.exports = {
  getAdminInsightsPageContent,
  createAdminInsightsPageContent,
  updateAdminInsightsPageContent,
};


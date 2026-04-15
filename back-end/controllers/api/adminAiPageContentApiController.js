const db = require("../../config/db");

async function getAdminAiPageContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM ai_page_content ORDER BY id DESC LIMIT 1"
    );
    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching admin ai_page_content:", error.message);
    return res.status(500).json({ error: "Error fetching AI page content" });
  }
}

async function createAdminAiPageContent(req, res) {
  try {
    const b = req.body || {};
    if (!b.banner_title) {
      return res.status(400).json({ error: "banner_title is required" });
    }

    const query = `
      INSERT INTO ai_page_content
      (banner_title, section_title, lead_text, description, cta_button_text, cta_button_link)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      b.banner_title,
      b.section_title || null,
      b.lead_text || null,
      b.description || null,
      b.cta_button_text || null,
      b.cta_button_link || null,
    ]);

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating ai_page_content:", error.message);
    return res.status(500).json({ error: "Error creating AI page content" });
  }
}

async function updateAdminAiPageContent(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const b = req.body || {};
    if (!b.banner_title) {
      return res.status(400).json({ error: "banner_title is required" });
    }

    const [exists] = await db.query("SELECT id FROM ai_page_content WHERE id = ?", [
      id,
    ]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    const query = `
      UPDATE ai_page_content SET
        banner_title = ?,
        section_title = ?,
        lead_text = ?,
        description = ?,
        cta_button_text = ?,
        cta_button_link = ?
      WHERE id = ?
    `;

    await db.query(query, [
      b.banner_title,
      b.section_title || null,
      b.lead_text || null,
      b.description || null,
      b.cta_button_text || null,
      b.cta_button_link || null,
      id,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating ai_page_content:", error.message);
    return res.status(500).json({ error: "Error updating AI page content" });
  }
}

module.exports = {
  getAdminAiPageContent,
  createAdminAiPageContent,
  updateAdminAiPageContent,
};


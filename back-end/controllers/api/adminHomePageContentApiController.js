const db = require("../../config/db");

async function getAdminHomePageContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM home_page_content ORDER BY id DESC LIMIT 1"
    );
    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching admin home_page_content:", error.message);
    return res.status(500).json({ error: "Error fetching home page content" });
  }
}

async function createAdminHomePageContent(req, res) {
  try {
    const b = req.body || {};
    if (!b.hero_title) {
      return res.status(400).json({ error: "hero_title is required" });
    }

    const query = `
      INSERT INTO home_page_content
      (hero_title, hero_subtitle, hero_button1_text, hero_button1_link, hero_button2_text, hero_button2_link,
       why_title, why_description, ai_showcase_title, ai_showcase_description,
       home_cta_title, home_cta_description, home_cta_button1_text, home_cta_button1_link, home_cta_button2_text, home_cta_button2_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      b.hero_title,
      b.hero_subtitle || null,
      b.hero_button1_text || null,
      b.hero_button1_link || null,
      b.hero_button2_text || null,
      b.hero_button2_link || null,
      b.why_title || null,
      b.why_description || null,
      b.ai_showcase_title || null,
      b.ai_showcase_description || null,
      b.home_cta_title || null,
      b.home_cta_description || null,
      b.home_cta_button1_text || null,
      b.home_cta_button1_link || null,
      b.home_cta_button2_text || null,
      b.home_cta_button2_link || null,
    ]);

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating home_page_content:", error.message);
    return res.status(500).json({ error: "Error creating home page content" });
  }
}

async function updateAdminHomePageContent(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const b = req.body || {};
    if (!b.hero_title) {
      return res.status(400).json({ error: "hero_title is required" });
    }

    const [exists] = await db.query("SELECT id FROM home_page_content WHERE id = ?", [
      id,
    ]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    const query = `
      UPDATE home_page_content SET
        hero_title = ?,
        hero_subtitle = ?,
        hero_button1_text = ?,
        hero_button1_link = ?,
        hero_button2_text = ?,
        hero_button2_link = ?,
        why_title = ?,
        why_description = ?,
        ai_showcase_title = ?,
        ai_showcase_description = ?,
        home_cta_title = ?,
        home_cta_description = ?,
        home_cta_button1_text = ?,
        home_cta_button1_link = ?,
        home_cta_button2_text = ?,
        home_cta_button2_link = ?
      WHERE id = ?
    `;

    await db.query(query, [
      b.hero_title,
      b.hero_subtitle || null,
      b.hero_button1_text || null,
      b.hero_button1_link || null,
      b.hero_button2_text || null,
      b.hero_button2_link || null,
      b.why_title || null,
      b.why_description || null,
      b.ai_showcase_title || null,
      b.ai_showcase_description || null,
      b.home_cta_title || null,
      b.home_cta_description || null,
      b.home_cta_button1_text || null,
      b.home_cta_button1_link || null,
      b.home_cta_button2_text || null,
      b.home_cta_button2_link || null,
      id,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating home_page_content:", error.message);
    return res.status(500).json({ error: "Error updating home page content" });
  }
}

module.exports = {
  getAdminHomePageContent,
  createAdminHomePageContent,
  updateAdminHomePageContent,
};


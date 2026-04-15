const db = require("../../config/db");

async function getAdminAboutContent(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query("SELECT * FROM about_content ORDER BY id DESC LIMIT 1");
    return res.json({ content: rows[0] || null });
  } catch (error) {
    console.error("Error fetching admin about_content:", error.message);
    return res.status(500).json({ error: "Error fetching about content" });
  }
}

async function createAdminAboutContent(req, res) {
  try {
    const b = req.body || {};
    if (!b.banner_title) return res.status(400).json({ error: "banner_title is required" });

    const query = `
      INSERT INTO about_content
      (banner_title, main_title, main_subtitle, section_title, paragraph_1, paragraph_2, paragraph_3,
       about_image, vision_title, vision_text, mission_title, mission_text,
       cta_title, cta_description, cta_button1_text, cta_button1_link, cta_button2_text, cta_button2_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      b.banner_title,
      b.main_title || null,
      b.main_subtitle || null,
      b.section_title || null,
      b.paragraph_1 || null,
      b.paragraph_2 || null,
      b.paragraph_3 || null,
      b.about_image || null,
      b.vision_title || null,
      b.vision_text || null,
      b.mission_title || null,
      b.mission_text || null,
      b.cta_title || null,
      b.cta_description || null,
      b.cta_button1_text || null,
      b.cta_button1_link || null,
      b.cta_button2_text || null,
      b.cta_button2_link || null,
    ]);

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating about_content:", error.message);
    return res.status(500).json({ error: "Error creating about content" });
  }
}

async function updateAdminAboutContent(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const b = req.body || {};
    if (!b.banner_title) return res.status(400).json({ error: "banner_title is required" });

    const [exists] = await db.query("SELECT id FROM about_content WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    const query = `
      UPDATE about_content SET
        banner_title = ?,
        main_title = ?,
        main_subtitle = ?,
        section_title = ?,
        paragraph_1 = ?,
        paragraph_2 = ?,
        paragraph_3 = ?,
        about_image = ?,
        vision_title = ?,
        vision_text = ?,
        mission_title = ?,
        mission_text = ?,
        cta_title = ?,
        cta_description = ?,
        cta_button1_text = ?,
        cta_button1_link = ?,
        cta_button2_text = ?,
        cta_button2_link = ?
      WHERE id = ?
    `;

    await db.query(query, [
      b.banner_title,
      b.main_title || null,
      b.main_subtitle || null,
      b.section_title || null,
      b.paragraph_1 || null,
      b.paragraph_2 || null,
      b.paragraph_3 || null,
      b.about_image || null,
      b.vision_title || null,
      b.vision_text || null,
      b.mission_title || null,
      b.mission_text || null,
      b.cta_title || null,
      b.cta_description || null,
      b.cta_button1_text || null,
      b.cta_button1_link || null,
      b.cta_button2_text || null,
      b.cta_button2_link || null,
      id,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating about_content:", error.message);
    return res.status(500).json({ error: "Error updating about content" });
  }
}

module.exports = {
  getAdminAboutContent,
  createAdminAboutContent,
  updateAdminAboutContent,
};


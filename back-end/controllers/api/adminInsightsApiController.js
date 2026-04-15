const db = require("../../config/db");

const listAdminInsights = async (req, res) => {
  try {
    const [insights] = await db.query("SELECT * FROM insights ORDER BY sort_order ASC, id DESC");
    res.json({ insights });
  } catch (error) {
    console.error("Error fetching admin insights:", error.message);
    res.status(500).json({ error: "Error fetching admin insights" });
  }
};

const getAdminInsight = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM insights WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Insight not found" });
    res.json({ insight: rows[0] });
  } catch (error) {
    console.error("Error fetching admin insight:", error.message);
    res.status(500).json({ error: "Error fetching admin insight" });
  }
};

const createAdminInsight = async (req, res) => {
  try {
    const {
      slug,
      tag,
      year,
      date_label,
      title,
      excerpt,
      thumbnail_image,
      hero_image,
      body,
      gallery_images,
      cta_label,
      cta_link,
      sort_order,
      is_published,
    } = req.body || {};

    if (!title || !slug) {
      return res.status(400).json({ error: "title and slug are required" });
    }

    const query = `
      INSERT INTO insights
      (slug, tag, year, date_label, title, excerpt, thumbnail_image, hero_image, body, gallery_images, cta_label, cta_link, sort_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      slug,
      tag || null,
      year || null,
      date_label || null,
      title,
      excerpt || null,
      thumbnail_image || null,
      hero_image || null,
      body || null,
      gallery_images || null,
      cta_label || null,
      cta_link || null,
      Number.isFinite(Number(sort_order)) ? Number(sort_order) : 0,
      is_published === true || is_published === 1 || is_published === "1" ? 1 : 0,
    ]);

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    const msg = String(error && error.message ? error.message : "");
    if (msg.includes("Duplicate") || msg.includes("ER_DUP_ENTRY")) {
      return res.status(409).json({ error: "Slug already exists" });
    }
    console.error("Error creating insight:", error.message);
    res.status(500).json({ error: "Error creating insight" });
  }
};

const updateAdminInsight = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      slug,
      tag,
      year,
      date_label,
      title,
      excerpt,
      thumbnail_image,
      hero_image,
      body,
      gallery_images,
      cta_label,
      cta_link,
      sort_order,
      is_published,
    } = req.body || {};

    const [rows] = await db.query("SELECT id FROM insights WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Insight not found" });

    const fields = [];
    const values = [];

    if (slug !== undefined) { fields.push("slug = ?"); values.push(slug); }
    if (tag !== undefined) { fields.push("tag = ?"); values.push(tag || null); }
    if (year !== undefined) { fields.push("year = ?"); values.push(year || null); }
    if (date_label !== undefined) { fields.push("date_label = ?"); values.push(date_label || null); }
    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (excerpt !== undefined) { fields.push("excerpt = ?"); values.push(excerpt || null); }
    if (thumbnail_image !== undefined) { fields.push("thumbnail_image = ?"); values.push(thumbnail_image || null); }
    if (hero_image !== undefined) { fields.push("hero_image = ?"); values.push(hero_image || null); }
    if (body !== undefined) { fields.push("body = ?"); values.push(body || null); }
    if (gallery_images !== undefined) { fields.push("gallery_images = ?"); values.push(gallery_images || null); }
    if (cta_label !== undefined) { fields.push("cta_label = ?"); values.push(cta_label || null); }
    if (cta_link !== undefined) { fields.push("cta_link = ?"); values.push(cta_link || null); }
    if (sort_order !== undefined) { fields.push("sort_order = ?"); values.push(Number.isFinite(Number(sort_order)) ? Number(sort_order) : 0); }
    if (is_published !== undefined) { fields.push("is_published = ?"); values.push(is_published === true || is_published === 1 || is_published === "1" ? 1 : 0); }

    if (fields.length === 0) return res.json({ ok: true });

    const query = `UPDATE insights SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    await db.query(query, values);
    res.json({ ok: true });
  } catch (error) {
    const msg = String(error && error.message ? error.message : "");
    if (msg.includes("Duplicate") || msg.includes("ER_DUP_ENTRY")) {
      return res.status(409).json({ error: "Slug already exists" });
    }
    console.error("Error updating insight:", error.message);
    res.status(500).json({ error: "Error updating insight" });
  }
};

const deleteAdminInsight = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT id FROM insights WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Insight not found" });
    await db.query("DELETE FROM insights WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting insight:", error.message);
    res.status(500).json({ error: "Error deleting insight" });
  }
};

module.exports = {
  listAdminInsights,
  getAdminInsight,
  createAdminInsight,
  updateAdminInsight,
  deleteAdminInsight,
};


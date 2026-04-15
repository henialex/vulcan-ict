const db = require("../../config/db");

const getAdminSiteSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1");
    res.set("Cache-Control", "no-store");
    res.json({ settings: rows && rows.length ? rows[0] : null });
  } catch (error) {
    console.error("Error fetching admin site settings:", error.message);
    res.status(500).json({ error: "Error fetching site settings" });
  }
};

const createAdminSiteSettings = async (req, res) => {
  try {
    const {
      site_name,
      footer_about,
      newsletter_text,
      facebook_link,
      twitter_link,
      instagram_link,
      linkedin_link,
      office_city,
      office_address,
      office_phone,
      office_hours,
      office_email,
      map_embed_url,
    } = req.body || {};

    if (!site_name) return res.status(400).json({ error: "site_name is required" });

    const query = `
      INSERT INTO site_settings
      (site_name, footer_about, newsletter_text, facebook_link, twitter_link, instagram_link, linkedin_link,
       office_city, office_address, office_phone, office_hours, office_email, map_embed_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      site_name,
      footer_about || null,
      newsletter_text || null,
      facebook_link || null,
      twitter_link || null,
      instagram_link || null,
      linkedin_link || null,
      office_city || null,
      office_address || null,
      office_phone || null,
      office_hours || null,
      office_email || null,
      map_embed_url || null,
    ]);

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating site settings:", error.message);
    res.status(500).json({ error: "Error creating site settings" });
  }
};

const updateAdminSiteSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      site_name,
      footer_about,
      newsletter_text,
      facebook_link,
      twitter_link,
      instagram_link,
      linkedin_link,
      office_city,
      office_address,
      office_phone,
      office_hours,
      office_email,
      map_embed_url,
    } = req.body || {};

    const [rows] = await db.query("SELECT id FROM site_settings WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Settings not found" });

    if (!site_name) return res.status(400).json({ error: "site_name is required" });

    const query = `
      UPDATE site_settings SET
        site_name = ?,
        footer_about = ?,
        newsletter_text = ?,
        facebook_link = ?,
        twitter_link = ?,
        instagram_link = ?,
        linkedin_link = ?,
        office_city = ?,
        office_address = ?,
        office_phone = ?,
        office_hours = ?,
        office_email = ?,
        map_embed_url = ?
      WHERE id = ?
    `;

    await db.query(query, [
      site_name,
      footer_about || null,
      newsletter_text || null,
      facebook_link || null,
      twitter_link || null,
      instagram_link || null,
      linkedin_link || null,
      office_city || null,
      office_address || null,
      office_phone || null,
      office_hours || null,
      office_email || null,
      map_embed_url || null,
      id,
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating site settings:", error.message);
    res.status(500).json({ error: "Error updating site settings" });
  }
};

module.exports = {
  getAdminSiteSettings,
  createAdminSiteSettings,
  updateAdminSiteSettings,
};


const db = require("../../config/db");

const listAdminServices = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM services ORDER BY id DESC");
    res.json({ services });
  } catch (error) {
    console.error("Error fetching admin services:", error.message);
    res.status(500).json({ error: "Error fetching admin services" });
  }
};

const getAdminService = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Service not found" });
    res.json({ service: rows[0] });
  } catch (error) {
    console.error("Error fetching admin service:", error.message);
    res.status(500).json({ error: "Error fetching admin service" });
  }
};

const createAdminService = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      problem,
      target_audience,
      trust_reason,
      features,
      icon_class,
    } = req.body || {};

    const query = `
      INSERT INTO services
      (title, category, description, problem, target_audience, trust_reason, features, icon_class)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      title || null,
      category || null,
      description || null,
      problem || null,
      target_audience || null,
      trust_reason || null,
      features || null,
      icon_class || null,
    ]);

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).json({ error: "Error adding service" });
  }
};

const updateAdminService = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      category,
      description,
      problem,
      target_audience,
      trust_reason,
      features,
      icon_class,
    } = req.body || {};

    const [rows] = await db.query("SELECT id FROM services WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Service not found" });

    const query = `
      UPDATE services
      SET
        title = ?,
        category = ?,
        description = ?,
        problem = ?,
        target_audience = ?,
        trust_reason = ?,
        features = ?,
        icon_class = ?
      WHERE id = ?
    `;

    await db.query(query, [
      title || null,
      category || null,
      description || null,
      problem || null,
      target_audience || null,
      trust_reason || null,
      features || null,
      icon_class || null,
      id,
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).json({ error: "Error updating service" });
  }
};

const deleteAdminService = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT id FROM services WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Service not found" });
    await db.query("DELETE FROM services WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: "Error deleting service" });
  }
};

module.exports = {
  listAdminServices,
  getAdminService,
  createAdminService,
  updateAdminService,
  deleteAdminService,
};


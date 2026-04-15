const db = require("../../config/db");

const listAdminPartners = async (req, res) => {
  try {
    const [partners] = await db.query(
      "SELECT * FROM partners ORDER BY sort_order ASC, id ASC"
    );
    res.json({ partners });
  } catch (error) {
    console.error("Error fetching admin partners:", error.message);
    res.status(500).json({ error: "Error fetching partners" });
  }
};

const getAdminPartner = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM partners WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Partner not found" });
    res.json({ partner: rows[0] });
  } catch (error) {
    console.error("Error fetching admin partner:", error.message);
    res.status(500).json({ error: "Error fetching partner" });
  }
};

const createAdminPartner = async (req, res) => {
  try {
    const { name, partner_type, description, logo_image, icon_class, sort_order } = req.body || {};

    if (!name || !partner_type) {
      return res.status(400).json({ error: "name and partner_type are required" });
    }

    const [result] = await db.query(
      `
        INSERT INTO partners
        (name, partner_type, description, logo_image, icon_class, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        partner_type,
        description || null,
        logo_image || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : 0,
      ]
    );

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating partner:", error.message);
    res.status(500).json({ error: "Error creating partner" });
  }
};

const updateAdminPartner = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, partner_type, description, logo_image, icon_class, sort_order } = req.body || {};

    const [rows] = await db.query("SELECT id FROM partners WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Partner not found" });

    if (!name || !partner_type) {
      return res.status(400).json({ error: "name and partner_type are required" });
    }

    await db.query(
      `
        UPDATE partners SET
          name = ?,
          partner_type = ?,
          description = ?,
          logo_image = ?,
          icon_class = ?,
          sort_order = ?
        WHERE id = ?
      `,
      [
        name,
        partner_type,
        description || null,
        logo_image || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : 0,
        id,
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating partner:", error.message);
    res.status(500).json({ error: "Error updating partner" });
  }
};

const deleteAdminPartner = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT id FROM partners WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Partner not found" });
    await db.query("DELETE FROM partners WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting partner:", error.message);
    res.status(500).json({ error: "Error deleting partner" });
  }
};

module.exports = {
  listAdminPartners,
  getAdminPartner,
  createAdminPartner,
  updateAdminPartner,
  deleteAdminPartner,
};


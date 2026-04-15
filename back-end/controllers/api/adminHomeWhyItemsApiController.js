const db = require("../../config/db");

async function listAdminHomeWhyItems(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const [rows] = await db.query(
      "SELECT * FROM home_why_items ORDER BY sort_order ASC, id ASC"
    );
    return res.json({ items: rows });
  } catch (error) {
    console.error("Error fetching admin home_why_items:", error.message);
    return res.status(500).json({ error: "Error fetching home why items" });
  }
}

async function getAdminHomeWhyItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
    const [rows] = await db.query("SELECT * FROM home_why_items WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ item: rows[0] });
  } catch (error) {
    console.error("Error fetching admin home_why_item:", error.message);
    return res.status(500).json({ error: "Error fetching home why item" });
  }
}

async function createAdminHomeWhyItem(req, res) {
  try {
    const { title, description, icon_class, sort_order } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const [result] = await db.query(
      "INSERT INTO home_why_items (title, description, icon_class, sort_order) VALUES (?, ?, ?, ?)",
      [
        title,
        description || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
      ]
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating home_why_item:", error.message);
    return res.status(500).json({ error: "Error creating home why item" });
  }
}

async function updateAdminHomeWhyItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, description, icon_class, sort_order } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const [exists] = await db.query("SELECT id FROM home_why_items WHERE id = ?", [
      id,
    ]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query(
      "UPDATE home_why_items SET title = ?, description = ?, icon_class = ?, sort_order = ? WHERE id = ?",
      [
        title,
        description || null,
        icon_class || null,
        Number.isFinite(Number(sort_order)) ? Number(sort_order) : null,
        id,
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error updating home_why_item:", error.message);
    return res.status(500).json({ error: "Error updating home why item" });
  }
}

async function deleteAdminHomeWhyItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [exists] = await db.query("SELECT id FROM home_why_items WHERE id = ?", [id]);
    if (!exists.length) return res.status(404).json({ error: "Not found" });

    await db.query("DELETE FROM home_why_items WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting home_why_item:", error.message);
    return res.status(500).json({ error: "Error deleting home why item" });
  }
}

module.exports = {
  listAdminHomeWhyItems,
  getAdminHomeWhyItem,
  createAdminHomeWhyItem,
  updateAdminHomeWhyItem,
  deleteAdminHomeWhyItem,
};


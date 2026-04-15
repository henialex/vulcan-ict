const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

const listAdminProjects = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM projects
      ORDER BY id DESC
    `;
    const [projects] = await db.query(query);
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching admin projects:", error.message);
    res.status(500).json({ error: "Error fetching admin projects" });
  }
};

const getAdminProject = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ project: rows[0] });
  } catch (error) {
    console.error("Error fetching admin project:", error.message);
    res.status(500).json({ error: "Error fetching admin project" });
  }
};

const createAdminProject = async (req, res) => {
  try {
    const { title, client, description, category } = req.body || {};
    const image = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO projects (title, client, description, category, image)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      title || null,
      client || null,
      description || null,
      category || null,
      image,
    ]);

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding project:", error.message);
    res.status(500).json({ error: "Error adding project" });
  }
};

const updateAdminProject = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, client, description, category } = req.body || {};

    const [rows] = await db.query("SELECT image FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Project not found" });

    const oldImage = rows[0].image;
    let newImage = oldImage;

    if (req.file) {
      newImage = req.file.filename;
      if (oldImage) {
        const oldImagePath = path.join(__dirname, "../../public/uploads/projects", oldImage);
        fs.unlink(oldImagePath, () => {});
      }
    }

    const query = `
      UPDATE projects
      SET title = ?, client = ?, description = ?, category = ?, image = ?
      WHERE id = ?
    `;

    await db.query(query, [
      title || null,
      client || null,
      description || null,
      category || null,
      newImage,
      id,
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({ error: "Error updating project" });
  }
};

const deleteAdminProject = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT image FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Project not found" });

    const image = rows[0].image;
    await db.query("DELETE FROM projects WHERE id = ?", [id]);

    if (image) {
      const imagePath = path.join(__dirname, "../../public/uploads/projects", image);
      fs.unlink(imagePath, () => {});
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ error: "Error deleting project" });
  }
};

module.exports = {
  listAdminProjects,
  getAdminProject,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
};


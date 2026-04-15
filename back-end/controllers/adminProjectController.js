const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const getAdminAddProjectPage = (req, res) => {
  const success = req.query.success;
  res.render("admin/add-project", { success });
};

const createProject = async (req, res) => {
  try {
    const { title, client, description, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO projects (title, client, description, category, image)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [title, client, description, category, image]);

    res.redirect("/admin/add-project?success=1");
  } catch (error) {
    console.error("Error adding project:", error.message);
    res.status(500).send("Error adding project");
  }
};

const getAdminProjectsPage = async (req, res) => {
  try {
    const query = `
      SELECT id, title, client, category, image, created_at
      FROM projects
      ORDER BY id DESC
    `;

    const [projects] = await db.query(query);

    res.render("admin/projects", { projects });
  } catch (error) {
    console.error("Error fetching admin projects:", error.message);
    res.status(500).send("Error fetching admin projects");
  }
};

const getEditProjectPage = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Project not found");
    }

    const success = req.query.success;
    res.render("admin/edit-project", {
      project: rows[0],
      success,
    });
  } catch (error) {
    console.error("Error fetching project for edit:", error.message);
    res.status(500).send("Error fetching project for edit");
  }
};

const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, client, description, category } = req.body;

    const [rows] = await db.query("SELECT image FROM projects WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Project not found");
    }

    const oldImage = rows[0].image;
    let newImage = oldImage;

    if (req.file) {
      newImage = req.file.filename;

      if (oldImage) {
        const oldImagePath = path.join(__dirname, "../public/uploads/projects", oldImage);

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err.message);
          }
        });
      }
    }

    const query = `
      UPDATE projects
      SET title = ?, client = ?, description = ?, category = ?, image = ?
      WHERE id = ?
    `;

    await db.query(query, [title, client, description, category, newImage, id]);

    res.redirect(`/admin/edit-project/${id}?success=1`);
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).send("Error updating project");
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query("SELECT image FROM projects WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.send("Project not found");
    }

    const image = rows[0].image;

    await db.query("DELETE FROM projects WHERE id = ?", [id]);

    if (image) {
      const imagePath = path.join(__dirname, "../public/uploads/projects", image);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err.message);
        }
      });
    }

    res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).send("Error deleting project");
  }
};

module.exports = {
  getAdminAddProjectPage,
  createProject,
  getAdminProjectsPage,
  getEditProjectPage,
  updateProject,
  deleteProject,
};
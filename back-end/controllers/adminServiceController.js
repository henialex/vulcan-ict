const db = require("../config/db");

const getAdminServicesPage = async (req, res) => {
  try {
    const query = `
      SELECT id, title, category, icon_class, created_at
      FROM services
      ORDER BY id DESC
    `;

    const [services] = await db.query(query);

    res.render("admin/services", { services });
  } catch (error) {
    console.error("Error fetching admin services:", error.message);
    res.status(500).send("Error fetching admin services");
  }
};

const getAddServicePage = (req, res) => {
  const success = req.query.success;
  res.render("admin/add-service", { success });
};

const createService = async (req, res) => {
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
    } = req.body;

    const query = `
      INSERT INTO services
      (title, category, description, problem, target_audience, trust_reason, features, icon_class)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      title,
      category,
      description,
      problem,
      target_audience,
      trust_reason,
      features,
      icon_class,
    ]);

    res.redirect("/admin/add-service?success=1");
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).send("Error adding service");
  }
};

const getEditServicePage = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Service not found");
    }

    const success = req.query.success;
    res.render("admin/edit-service", {
      service: rows[0],
      success,
    });
  } catch (error) {
    console.error("Error fetching service for edit:", error.message);
    res.status(500).send("Error fetching service for edit");
  }
};

const updateService = async (req, res) => {
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
    } = req.body;

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
      title,
      category,
      description,
      problem,
      target_audience,
      trust_reason,
      features,
      icon_class,
      id,
    ]);

    res.redirect(`/admin/edit-service/${id}?success=1`);
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).send("Error updating service");
  }
};

const deleteService = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query("SELECT id FROM services WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Service not found");
    }

    await db.query("DELETE FROM services WHERE id = ?", [id]);

    res.redirect("/admin/services");
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).send("Error deleting service");
  }
};

module.exports = {
  getAdminServicesPage,
  getAddServicePage,
  createService,
  getEditServicePage,
  updateService,
  deleteService,
};
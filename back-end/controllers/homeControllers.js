const db = require("../config/db");

const getHomePage = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM projects");

    res.render("home", { projects: results });
  } catch (error) {
    console.error("Failed to fetch projects:", error.message);
    return res.status(500).send("Database error");
  }
};

module.exports = {
  getHomePage,
};
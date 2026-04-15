const db = require("../config/db");

const getServicesPage = async (req, res) => {
  try {
    const servicesQuery = "SELECT * FROM services";
    const categoriesQuery = "SELECT * FROM service_categories";
    const ctaQuery = "SELECT * FROM service_page_cta LIMIT 1";

    const [servicesResults] = await db.query(servicesQuery);
    const [categoriesResults] = await db.query(categoriesQuery);
    const [ctaResults] = await db.query(ctaQuery);

    res.render("services", {
      services: servicesResults,
      categories: categoriesResults,
      cta: ctaResults[0],
    });
  } catch (error) {
    console.error("Error fetching services page data:", error.message);
    return res.status(500).send("Error fetching services page data");
  }
};

module.exports = {
  getServicesPage,
};
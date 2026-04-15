const db = require("../../config/db");

const getServicesPageData = async (req, res) => {
  try {
    const servicesQuery = "SELECT * FROM services";
    const categoriesQuery = "SELECT * FROM service_categories";
    const ctaQuery = "SELECT * FROM service_page_cta LIMIT 1";

    const [services] = await db.query(servicesQuery);
    const [categories] = await db.query(categoriesQuery);
    const [ctaResults] = await db.query(ctaQuery);

    res.json({
      services,
      categories,
      cta: ctaResults[0] || null,
    });
  } catch (error) {
    console.error("Error fetching services page data:", error.message);
    res.status(500).json({ error: "Error fetching services page data" });
  }
};

module.exports = {
  getServicesPageData,
};


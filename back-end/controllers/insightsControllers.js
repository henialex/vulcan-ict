const db = require("../config/db");

const getInsights = async (req, res) => {
  try {
    const query = `
      SELECT * FROM insights
      WHERE is_published = 1
      ORDER BY sort_order ASC
    `;

    const [results] = await db.query(query);

    res.render("insights", { insights: results });
  } catch (error) {
    console.error("Error fetching insights:", error.message);
    return res.status(500).send("Error fetching insights");
  }
};

const getSingleInsight = async (req, res) => {
  try {
    const slug = req.query.post;

    if (!slug) {
      return res.redirect("/insights");
    }

    const query = `
      SELECT * FROM insights
      WHERE slug = ?
      AND is_published = 1
      LIMIT 1
    `;

    const [results] = await db.query(query, [slug]);

    if (results.length === 0) {
      return res.status(404).send("Post not found");
    }

    res.render("single-blog", { post: results[0] });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return res.status(500).send("Error fetching post");
  }
};

module.exports = {
  getInsights,
  getSingleInsight,
};
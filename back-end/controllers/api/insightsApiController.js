const db = require("../../config/db");

const listInsights = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM insights
      WHERE is_published = 1
      ORDER BY sort_order ASC
    `;

    const [insights] = await db.query(query);

    res.set("Cache-Control", "no-store");
    res.json({ insights });
  } catch (error) {
    console.error("Error fetching insights:", error.message);
    res.status(500).json({ error: "Error fetching insights" });
  }
};

const getInsightBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    const query = `
      SELECT *
      FROM insights
      WHERE slug = ?
      AND is_published = 1
      LIMIT 1
    `;

    const [results] = await db.query(query, [slug]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.set("Cache-Control", "no-store");
    res.json({ post: results[0] });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Error fetching post" });
  }
};

module.exports = {
  listInsights,
  getInsightBySlug,
};


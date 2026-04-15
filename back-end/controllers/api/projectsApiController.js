const db = require("../../config/db");

/**
 * Home "Case studies" order (featured pair first, then wide cards), not insertion order.
 * Matches the static fallback in front-end/index.html.
 *
 * BunaLink titles contain the word "enterprise" ("Enterprise Coffee Export") — match BunaLink
 * before any generic "enterprise" rule.
 */
function homePageProjectSortKey(project) {
  const t = String(project.title || "").toLowerCase();
  if (t.includes("ecta") || t.includes("ethiopian coffee")) return 0;
  if (t.includes("bunalink")) return 2;
  if (t.includes("lumos")) return 3;
  if (t.includes("enterprise")) return 1;
  return 100;
}

const listProjects = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects");
    const projects = [...rows].sort(
      (a, b) =>
        homePageProjectSortKey(a) - homePageProjectSortKey(b) ||
        (Number(a.id) || 0) - (Number(b.id) || 0)
    );
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ error: "Error fetching projects" });
  }
};

module.exports = {
  listProjects,
};


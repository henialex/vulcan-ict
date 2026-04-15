const db = require("./db");

/**
 * Creates project_tags / project_timelines if missing (local dev often skips SQL migrations).
 */
async function ensureProjectMetaTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS project_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      label VARCHAR(255) NOT NULL,
      icon_class VARCHAR(255) NULL,
      sort_order INT NULL,
      KEY idx_project_tags_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS project_timelines (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT NULL,
      sort_order INT NULL,
      KEY idx_project_timelines_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

module.exports = { ensureProjectMetaTables };

const db = require("../../config/db");

const listAdminMessages = async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, subject, message, created_at
      FROM contact_messages
      ORDER BY id DESC
    `;
    const [messages] = await db.query(query);
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).json({ error: "Error fetching contact messages" });
  }
};

module.exports = {
  listAdminMessages,
};


const db = require("../config/db");

const getAdminMessagesPage = async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, subject, message, created_at
      FROM contact_messages
      ORDER BY id DESC
    `;

    const [messages] = await db.query(query);

    res.render("admin/messages", { messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).send("Error fetching contact messages");
  }
};

module.exports = {
  getAdminMessagesPage,
};
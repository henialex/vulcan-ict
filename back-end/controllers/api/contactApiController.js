const db = require("../../config/db");

const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    const trimmedName = String(name || "").trim();
    const trimmedEmail = String(email || "").trim();
    const trimmedSubject = String(subject || "").trim();
    const trimmedMessage = String(message || "").trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res
        .status(400)
        .json({ error: "Please fill in name, email, and message." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(query, [
      trimmedName,
      trimmedEmail,
      trimmedSubject || null,
      trimmedMessage,
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error saving contact message:", error.message);
    res.status(500).json({ error: "Something went wrong while sending your message." });
  }
};

module.exports = {
  createContactMessage,
};


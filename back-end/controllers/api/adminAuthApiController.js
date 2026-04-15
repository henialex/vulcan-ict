const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const trimmedEmail = String(email || "").trim();
    const trimmedPassword = String(password || "");

    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [trimmedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(trimmedPassword, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      getJwtSecret(),
      { expiresIn: "12h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ error: "Login error" });
  }
};

module.exports = {
  loginAdmin,
};


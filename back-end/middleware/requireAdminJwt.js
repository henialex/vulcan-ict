const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

const requireAdminJwt = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = requireAdminJwt;


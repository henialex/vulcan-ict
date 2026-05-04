const express = require("express");
const router = express.Router();

router.get("/admin", (_req, res) => {
  res.redirect("/admin/dashboard.html");
});

module.exports = router;
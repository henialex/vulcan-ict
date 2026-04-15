const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");

router.get("/admin", authAdmin, (req, res) => {
  res.render("admin/dashboard");
});

module.exports = router;
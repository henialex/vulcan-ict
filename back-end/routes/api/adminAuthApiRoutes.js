const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../../controllers/api/adminAuthApiController");

router.post("/admin/login", loginAdmin);

module.exports = router;


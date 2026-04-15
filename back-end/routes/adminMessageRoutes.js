const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");
const { getAdminMessagesPage } = require("../controllers/adminMessageController");

router.get("/admin/messages", authAdmin, getAdminMessagesPage);

module.exports = router;
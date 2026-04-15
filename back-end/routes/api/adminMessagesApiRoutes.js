const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");
const { listAdminMessages } = require("../../controllers/api/adminMessagesApiController");

router.get("/admin/messages", requireAdminJwt, listAdminMessages);

module.exports = router;


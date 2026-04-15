const express = require("express");
const router = express.Router();

const { createContactMessage } = require("../../controllers/api/contactApiController");

router.post("/contact", createContactMessage);

module.exports = router;


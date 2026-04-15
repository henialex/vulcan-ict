const express = require("express");
const { getAboutContent } = require("../../controllers/api/aboutContentApiController");

const router = express.Router();

router.get("/about-content", getAboutContent);

module.exports = router;


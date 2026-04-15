const express = require("express");
const { getAiPageContent } = require("../../controllers/api/aiPageContentApiController");

const router = express.Router();

router.get("/ai-page-content", getAiPageContent);

module.exports = router;


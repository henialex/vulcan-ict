const express = require("express");
const {
  getInsightsPageContent,
} = require("../../controllers/api/insightsPageContentApiController");

const router = express.Router();

router.get("/insights-page-content", getInsightsPageContent);

module.exports = router;


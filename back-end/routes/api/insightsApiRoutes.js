const express = require("express");
const router = express.Router();

const {
  listInsights,
  getInsightBySlug,
} = require("../../controllers/api/insightsApiController");

router.get("/insights", listInsights);
router.get("/insights/:slug", getInsightBySlug);

module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getInsights,
  getSingleInsight,
} = require("../controllers/insightsControllers");

router.get("/insights", getInsights);
router.get("/single-blog", getSingleInsight);

module.exports = router;
const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  getAdminInsightsPageContent,
  createAdminInsightsPageContent,
  updateAdminInsightsPageContent,
} = require("../../controllers/api/adminInsightsPageContentApiController");

const router = express.Router();

router.get(
  "/admin/insights-page-content",
  requireAdminJwt,
  getAdminInsightsPageContent
);
router.post(
  "/admin/insights-page-content",
  requireAdminJwt,
  createAdminInsightsPageContent
);
router.put(
  "/admin/insights-page-content/:id",
  requireAdminJwt,
  updateAdminInsightsPageContent
);

module.exports = router;


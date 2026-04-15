const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  listAdminInsights,
  getAdminInsight,
  createAdminInsight,
  updateAdminInsight,
  deleteAdminInsight,
} = require("../../controllers/api/adminInsightsApiController");

router.get("/admin/insights", requireAdminJwt, listAdminInsights);
router.get("/admin/insights/:id", requireAdminJwt, getAdminInsight);
router.post("/admin/insights", requireAdminJwt, createAdminInsight);
router.put("/admin/insights/:id", requireAdminJwt, updateAdminInsight);
router.delete("/admin/insights/:id", requireAdminJwt, deleteAdminInsight);

module.exports = router;


const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  getAdminAiPageContent,
  createAdminAiPageContent,
  updateAdminAiPageContent,
} = require("../../controllers/api/adminAiPageContentApiController");

const {
  listAdminAiFeatures,
  getAdminAiFeature,
  createAdminAiFeature,
  updateAdminAiFeature,
  deleteAdminAiFeature,
} = require("../../controllers/api/adminAiFeaturesApiController");

const router = express.Router();

// ai_page_content (single latest row pattern)
router.get("/admin/ai-page-content", requireAdminJwt, getAdminAiPageContent);
router.post("/admin/ai-page-content", requireAdminJwt, createAdminAiPageContent);
router.put(
  "/admin/ai-page-content/:id",
  requireAdminJwt,
  updateAdminAiPageContent
);

// ai_features CRUD
router.get("/admin/ai-features", requireAdminJwt, listAdminAiFeatures);
router.get("/admin/ai-features/:id", requireAdminJwt, getAdminAiFeature);
router.post("/admin/ai-features", requireAdminJwt, createAdminAiFeature);
router.put("/admin/ai-features/:id", requireAdminJwt, updateAdminAiFeature);
router.delete("/admin/ai-features/:id", requireAdminJwt, deleteAdminAiFeature);

module.exports = router;


const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  getAdminAboutContent,
  createAdminAboutContent,
  updateAdminAboutContent,
} = require("../../controllers/api/adminAboutContentApiController");

const {
  listAdminAboutFeatures,
  getAdminAboutFeature,
  createAdminAboutFeature,
  updateAdminAboutFeature,
  deleteAdminAboutFeature,
} = require("../../controllers/api/adminAboutFeaturesApiController");

const router = express.Router();

// about_content (single latest row pattern)
router.get("/admin/about-content", requireAdminJwt, getAdminAboutContent);
router.post("/admin/about-content", requireAdminJwt, createAdminAboutContent);
router.put("/admin/about-content/:id", requireAdminJwt, updateAdminAboutContent);

// about_features CRUD
router.get("/admin/about-features", requireAdminJwt, listAdminAboutFeatures);
router.get("/admin/about-features/:id", requireAdminJwt, getAdminAboutFeature);
router.post("/admin/about-features", requireAdminJwt, createAdminAboutFeature);
router.put("/admin/about-features/:id", requireAdminJwt, updateAdminAboutFeature);
router.delete("/admin/about-features/:id", requireAdminJwt, deleteAdminAboutFeature);

module.exports = router;


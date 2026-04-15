const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  getAdminSiteSettings,
  createAdminSiteSettings,
  updateAdminSiteSettings,
} = require("../../controllers/api/adminSiteSettingsApiController");

router.get("/admin/site-settings", requireAdminJwt, getAdminSiteSettings);
router.post("/admin/site-settings", requireAdminJwt, createAdminSiteSettings);
router.put("/admin/site-settings/:id", requireAdminJwt, updateAdminSiteSettings);

module.exports = router;


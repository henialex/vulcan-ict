const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  getAdminHomePageContent,
  createAdminHomePageContent,
  updateAdminHomePageContent,
} = require("../../controllers/api/adminHomePageContentApiController");

const {
  listAdminHomeStats,
  getAdminHomeStat,
  createAdminHomeStat,
  updateAdminHomeStat,
  deleteAdminHomeStat,
} = require("../../controllers/api/adminHomeStatsApiController");

const {
  listAdminHomeWhyItems,
  getAdminHomeWhyItem,
  createAdminHomeWhyItem,
  updateAdminHomeWhyItem,
  deleteAdminHomeWhyItem,
} = require("../../controllers/api/adminHomeWhyItemsApiController");

const router = express.Router();

// home_page_content (single latest row pattern)
router.get("/admin/home-page-content", requireAdminJwt, getAdminHomePageContent);
router.post(
  "/admin/home-page-content",
  requireAdminJwt,
  createAdminHomePageContent
);
router.put(
  "/admin/home-page-content/:id",
  requireAdminJwt,
  updateAdminHomePageContent
);

// home_stats CRUD
router.get("/admin/home-stats", requireAdminJwt, listAdminHomeStats);
router.get("/admin/home-stats/:id", requireAdminJwt, getAdminHomeStat);
router.post("/admin/home-stats", requireAdminJwt, createAdminHomeStat);
router.put("/admin/home-stats/:id", requireAdminJwt, updateAdminHomeStat);
router.delete("/admin/home-stats/:id", requireAdminJwt, deleteAdminHomeStat);

// home_why_items CRUD
router.get("/admin/home-why-items", requireAdminJwt, listAdminHomeWhyItems);
router.get("/admin/home-why-items/:id", requireAdminJwt, getAdminHomeWhyItem);
router.post("/admin/home-why-items", requireAdminJwt, createAdminHomeWhyItem);
router.put("/admin/home-why-items/:id", requireAdminJwt, updateAdminHomeWhyItem);
router.delete(
  "/admin/home-why-items/:id",
  requireAdminJwt,
  deleteAdminHomeWhyItem
);

module.exports = router;


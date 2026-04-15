const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  listAdminProjectTags,
  createAdminProjectTag,
  updateAdminProjectTag,
  deleteAdminProjectTag,
} = require("../../controllers/api/adminProjectTagsApiController");

const {
  listAdminProjectTimelines,
  createAdminProjectTimeline,
  updateAdminProjectTimeline,
  deleteAdminProjectTimeline,
} = require("../../controllers/api/adminProjectTimelinesApiController");

const router = express.Router();

// project_tags scoped by project
router.get("/admin/projects/:projectId/tags", requireAdminJwt, listAdminProjectTags);
router.post(
  "/admin/projects/:projectId/tags",
  requireAdminJwt,
  createAdminProjectTag
);
router.put(
  "/admin/projects/:projectId/tags/:tagId",
  requireAdminJwt,
  updateAdminProjectTag
);
router.delete(
  "/admin/projects/:projectId/tags/:tagId",
  requireAdminJwt,
  deleteAdminProjectTag
);

// project_timelines scoped by project
router.get(
  "/admin/projects/:projectId/timelines",
  requireAdminJwt,
  listAdminProjectTimelines
);
router.post(
  "/admin/projects/:projectId/timelines",
  requireAdminJwt,
  createAdminProjectTimeline
);
router.put(
  "/admin/projects/:projectId/timelines/:timelineId",
  requireAdminJwt,
  updateAdminProjectTimeline
);
router.delete(
  "/admin/projects/:projectId/timelines/:timelineId",
  requireAdminJwt,
  deleteAdminProjectTimeline
);

module.exports = router;


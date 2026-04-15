const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");
const upload = require("../../middleware/uploadProjectImage");

const {
  listAdminProjects,
  getAdminProject,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} = require("../../controllers/api/adminProjectsApiController");

router.get("/admin/projects", requireAdminJwt, listAdminProjects);
router.get("/admin/projects/:id", requireAdminJwt, getAdminProject);
router.post(
  "/admin/projects",
  requireAdminJwt,
  upload.single("image"),
  createAdminProject
);
router.put(
  "/admin/projects/:id",
  requireAdminJwt,
  upload.single("image"),
  updateAdminProject
);
router.delete("/admin/projects/:id", requireAdminJwt, deleteAdminProject);

module.exports = router;


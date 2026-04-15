const express = require("express");
const router = express.Router();
const {
  getAdminAddProjectPage,
  createProject,
  getAdminProjectsPage,
  getEditProjectPage,
  updateProject,
  deleteProject,
} = require("../controllers/adminProjectController");
const upload = require("../middleware/uploadProjectImage");
const authAdmin = require("../middleware/authAdmin");

router.get("/admin/add-project", authAdmin, getAdminAddProjectPage);
router.post("/admin/add-project", authAdmin, upload.single("image"), createProject);

router.get("/admin/projects",authAdmin, getAdminProjectsPage);

router.get("/admin/edit-project/:id", authAdmin, getEditProjectPage);
router.post("/admin/edit-project/:id", authAdmin, upload.single("image"), updateProject);

router.get("/admin/delete-project/:id", authAdmin, deleteProject);

module.exports = router;
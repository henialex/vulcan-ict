const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  listAdminServices,
  getAdminService,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} = require("../../controllers/api/adminServicesApiController");

router.get("/admin/services", requireAdminJwt, listAdminServices);
router.get("/admin/services/:id", requireAdminJwt, getAdminService);
router.post("/admin/services", requireAdminJwt, createAdminService);
router.put("/admin/services/:id", requireAdminJwt, updateAdminService);
router.delete("/admin/services/:id", requireAdminJwt, deleteAdminService);

module.exports = router;


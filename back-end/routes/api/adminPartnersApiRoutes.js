const express = require("express");
const router = express.Router();

const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  listAdminPartners,
  getAdminPartner,
  createAdminPartner,
  updateAdminPartner,
  deleteAdminPartner,
} = require("../../controllers/api/adminPartnersApiController");

router.get("/admin/partners", requireAdminJwt, listAdminPartners);
router.get("/admin/partners/:id", requireAdminJwt, getAdminPartner);
router.post("/admin/partners", requireAdminJwt, createAdminPartner);
router.put("/admin/partners/:id", requireAdminJwt, updateAdminPartner);
router.delete("/admin/partners/:id", requireAdminJwt, deleteAdminPartner);

module.exports = router;


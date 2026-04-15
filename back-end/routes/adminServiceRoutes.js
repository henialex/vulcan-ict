const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");
const {
  getAdminServicesPage,
  getAddServicePage,
  createService,
  getEditServicePage,
  updateService,
  deleteService,
} = require("../controllers/adminServiceController");

router.get("/admin/services", authAdmin, getAdminServicesPage);
router.get("/admin/add-service", authAdmin, getAddServicePage);
router.post("/admin/add-service", authAdmin, createService);

router.get("/admin/edit-service/:id", authAdmin, getEditServicePage);
router.post("/admin/edit-service/:id", authAdmin, updateService);

router.get("/admin/delete-service/:id", authAdmin, deleteService);

module.exports = router;
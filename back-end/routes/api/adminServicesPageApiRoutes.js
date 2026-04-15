const express = require("express");
const requireAdminJwt = require("../../middleware/requireAdminJwt");

const {
  listAdminServiceProcessSteps,
  getAdminServiceProcessStep,
  createAdminServiceProcessStep,
  updateAdminServiceProcessStep,
  deleteAdminServiceProcessStep,
} = require("../../controllers/api/adminServiceProcessStepsApiController");

const {
  listAdminServiceProcessFeatures,
  getAdminServiceProcessFeature,
  createAdminServiceProcessFeature,
  updateAdminServiceProcessFeature,
  deleteAdminServiceProcessFeature,
} = require("../../controllers/api/adminServiceProcessFeaturesApiController");

const router = express.Router();

// process steps CRUD
router.get(
  "/admin/service-process-steps",
  requireAdminJwt,
  listAdminServiceProcessSteps
);
router.get(
  "/admin/service-process-steps/:id",
  requireAdminJwt,
  getAdminServiceProcessStep
);
router.post(
  "/admin/service-process-steps",
  requireAdminJwt,
  createAdminServiceProcessStep
);
router.put(
  "/admin/service-process-steps/:id",
  requireAdminJwt,
  updateAdminServiceProcessStep
);
router.delete(
  "/admin/service-process-steps/:id",
  requireAdminJwt,
  deleteAdminServiceProcessStep
);

// process features CRUD
router.get(
  "/admin/service-process-features",
  requireAdminJwt,
  listAdminServiceProcessFeatures
);
router.get(
  "/admin/service-process-features/:id",
  requireAdminJwt,
  getAdminServiceProcessFeature
);
router.post(
  "/admin/service-process-features",
  requireAdminJwt,
  createAdminServiceProcessFeature
);
router.put(
  "/admin/service-process-features/:id",
  requireAdminJwt,
  updateAdminServiceProcessFeature
);
router.delete(
  "/admin/service-process-features/:id",
  requireAdminJwt,
  deleteAdminServiceProcessFeature
);

module.exports = router;


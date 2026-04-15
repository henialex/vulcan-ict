const express = require("express");
const {
  listServiceProcessFeatures,
} = require("../../controllers/api/serviceProcessFeaturesApiController");

const router = express.Router();

router.get("/service-process-features", listServiceProcessFeatures);

module.exports = router;


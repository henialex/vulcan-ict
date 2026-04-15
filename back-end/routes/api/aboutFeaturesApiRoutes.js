const express = require("express");
const {
  listAboutFeatures,
} = require("../../controllers/api/aboutFeaturesApiController");

const router = express.Router();

router.get("/about-features", listAboutFeatures);

module.exports = router;


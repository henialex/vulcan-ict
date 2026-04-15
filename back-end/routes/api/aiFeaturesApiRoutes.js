const express = require("express");
const { listAiFeatures } = require("../../controllers/api/aiFeaturesApiController");

const router = express.Router();

router.get("/ai-features", listAiFeatures);

module.exports = router;


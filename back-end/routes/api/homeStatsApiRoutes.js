const express = require("express");
const { listHomeStats } = require("../../controllers/api/homeStatsApiController");

const router = express.Router();

router.get("/home-stats", listHomeStats);

module.exports = router;


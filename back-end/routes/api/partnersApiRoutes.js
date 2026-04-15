const express = require("express");
const router = express.Router();

const { listPartners } = require("../../controllers/api/partnersApiController");

router.get("/partners", listPartners);

module.exports = router;


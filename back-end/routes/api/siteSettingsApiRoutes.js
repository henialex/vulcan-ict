const express = require("express");
const router = express.Router();

const { getSiteSettings } = require("../../controllers/api/siteSettingsApiController");

router.get("/site-settings", getSiteSettings);

module.exports = router;


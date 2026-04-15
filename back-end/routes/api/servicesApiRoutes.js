const express = require("express");
const router = express.Router();

const { getServicesPageData } = require("../../controllers/api/servicesApiController");

router.get("/services-page", getServicesPageData);

module.exports = router;


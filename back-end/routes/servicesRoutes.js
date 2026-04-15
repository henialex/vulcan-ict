const express = require("express");
const router = express.Router();
const { getServicesPage } = require("../controllers/servicesController");

router.get("/services", getServicesPage);

module.exports = router;
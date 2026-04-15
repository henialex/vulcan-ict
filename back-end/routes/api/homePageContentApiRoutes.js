const express = require("express");
const {
  getHomePageContent,
} = require("../../controllers/api/homePageContentApiController");

const router = express.Router();

router.get("/home-page-content", getHomePageContent);

module.exports = router;


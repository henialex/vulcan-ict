const express = require("express");
const {
  listHomeWhyItems,
} = require("../../controllers/api/homeWhyItemsApiController");

const router = express.Router();

router.get("/home-why-items", listHomeWhyItems);

module.exports = router;


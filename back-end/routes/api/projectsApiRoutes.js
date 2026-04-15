const express = require("express");
const router = express.Router();

const { listProjects } = require("../../controllers/api/projectsApiController");
const { listProjectTags } = require("../../controllers/api/projectTagsApiController");
const {
  listProjectTimelines,
} = require("../../controllers/api/projectTimelinesApiController");

router.get("/projects", listProjects);
router.get("/projects/:id/tags", listProjectTags);
router.get("/projects/:id/timelines", listProjectTimelines);

module.exports = router;


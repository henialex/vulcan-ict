const express = require("express");
const {
  listServiceProcessSteps,
} = require("../../controllers/api/serviceProcessStepsApiController");

const router = express.Router();

router.get("/service-process-steps", listServiceProcessSteps);

module.exports = router;


"use strict";

var express = require("express");

var router = express.Router();

var availabilityController = require("../controllers/availability-controller");

router.get("/roomTrainerAvailability", availabilityController.getRoomTrainerAvailability);
router.post("/checkAvailability", availabilityController.checkAvailability);
module.exports = router;
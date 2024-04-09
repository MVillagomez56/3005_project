const express = require("express");
const router = express.Router();

const availabilityController = require("../controllers/availability-controller");

router.get("/roomTrainerAvailability", availabilityController.getRoomTrainerAvailability);

module.exports = router;
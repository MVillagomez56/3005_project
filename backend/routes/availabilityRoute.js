const express = require("express");
const router = express.Router();

const availabilityController = require("../controllers/availability-controller");

router.get("/roomTrainerAvailability", availabilityController.getRoomTrainerAvailability);
router.post("/checkAvailability", availabilityController.checkAvailability);

module.exports = router;
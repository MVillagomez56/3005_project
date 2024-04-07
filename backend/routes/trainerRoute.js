const express = require("express");
const router = express.Router();

const trainerController = require("../controllers/trainer-controller");

router.get("/getTrainerSchedule/:id", trainerController.getTrainerSchedule);

router.post("/updateTrainerSchedule/:id", trainerController.updateTrainerSchedule);

router.get("/getTrainerCourses/:id", trainerController.getTrainerCourses);

router.get("/availableTimeSlots/:id", trainerController.getTrainerAvailableTimeSlots);

module.exports = router;
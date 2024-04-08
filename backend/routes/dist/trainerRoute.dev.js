"use strict";

var express = require("express");

var router = express.Router();

var trainerController = require("../controllers/trainer-controller");

router.get("/getValidTrainers", trainerController.getAllValidTrainers);
router.get("/getTrainerSchedule/:id", trainerController.getTrainerSchedule);
router.post("/updateTrainerSchedule/:id", trainerController.updateTrainerSchedule);
router.get("/getTrainerCourses/:id", trainerController.getTrainerCourses);
router.get("/availableTimeSlots/:id", trainerController.getTrainerAvailableTimeSlots);
router.put("/updateTrainer/:id", trainerController.updateTrainer);
router.post("/addTrainerSchedule/:id", trainerController.addTrainerSchedule);
router.post('/schedule/:trainerId', trainerController.updateOrInsertSchedule);
router.get('/approvedClasses/:trainerId', trainerController.getApprovedClasses);
module.exports = router;
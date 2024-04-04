const express = require("express");
const router = express.Router();

const classController = require("../controllers/class-controller");

// Get router for room
// router.get("/rooms");

router.get("/getclasses", classController.getAllClasses);
router.get('/getSpecificClass/:id', classController.getClassById);

// router.get("/equipments")

// router.get("/rooms:id");

router.get("/getRoomById/:id", classController.getRoomById);

router.post("/updateClass/:id", classController.updateClassById);

router.get("/featuredClasses", classController.getPopularClasses);
router.get('/upcomingClasses/:id', classController.getUpcomingClasses);

router.post("/addClass", classController.addClass);

module.exports = router;
const express = require("express");
const router = express.Router();

const classController = require("../controllers/class-controller");

// Get router for room
// router.get("/rooms");

router.get("/getclasses", classController.getAllClasses);
router.get('/getSpecificClass/:id', classController.getClassById);

// router.get("/equipments")

// router.get("/rooms:id");

// router.get("/popular-class");

router.post("/addClass", classController.addClass);

module.exports = router;
const express = require("express");
const router = express.Router();

const classController = require("../controllers/class-controller");

// Get router for room
router.get("/api/rooms");

router.get("/api/classes", classController.getAllClasses);

router.get("/api/equipments")

router.get("/api/rooms:id");

router.get("/api/popular-class");

router.post("/api/addClass", classController.addClass);


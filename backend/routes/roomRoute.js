
const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room-controller");

router.get("/getRooms", roomController.getAllRooms);

router.get("/getRoomSchedule/:id", roomController.getRoomSchedule);

module.exports = router;
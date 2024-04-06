const express = require("express");
const router = express.Router();

const equipmentController = require("../controllers/equipment-controller");

router.get("/getEquipment", equipmentController.getAllEquipment);

router.get("/getEquipmentById/:id", equipmentController.getEquipmentById);

router.get('/changeEquipmentStatus/:id', equipmentController.changeEquipmentStatus);

module.exports = router;
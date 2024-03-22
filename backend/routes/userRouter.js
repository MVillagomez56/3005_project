const express = require("express");
const router = express.Router();

// The user-controller is where all the logic for modifying backend works

const userController = require("../controllers/users-controller");

// Get router 
router.get("/",)

router.get();


// Post routers
router.post("/registerUser", userController.registerUser);

router.post("/addMember", userController.addMember);

router.post("/addPayment", userController.addPayment);

router.post("/addFitnessGoal", userController.addFitnessGoal);
const express = require("express");
const router = express.Router();

// The user-controller is where all the logic for modifying backend works

const userController = require("../controllers/users-controller");

// Get router 
router.get("/api/user/:id", userController.getUserById);

router.get("/api/members", userController.getAllMembers);

router.get("/api/member/:userid", userController.getMemberById);



// Post routers
router.post("/api/registerUser", userController.registerUser);

router.post("/api/addMember", userController.addMember);

router.post("/api/addPayment", userController.addPayment);

router.post("/api/addFitnessGoal", userController.addFitnessGoal);
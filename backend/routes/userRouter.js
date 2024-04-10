const express = require("express");
const router = express.Router();

console.log("user router started");

// The user-controller is where all the logic for modifying backend works

const userController = require("../controllers/users-controller.js");

// Get router
router.get("/user/:id", userController.getUserById);

// router.get("/api/members", userController.getAllMembers);

router.get("/member/:userid", userController.getMemberById);

router.get("/searchMember", userController.searchMember);

router.get("/trainers", userController.getAllTrainersWithPF);

router.get("/fitnessGoals/:member_id", userController.getFitnessGoals);

router.get('/trainer/:id', userController.getTrainerDetailById);

router.get('/schedule/:id', userController.getTrainerSchedule);

router.get('/rooms', userController.getRooms);

router.post('/classes', userController.createClassSession);

// Post routers
router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/addPayment", userController.addPayment);

router.post("/addFitnessGoals/:member_id", userController.addFitnessGoals);

router.post("/addFitnessGoal/:member_id", userController.addFitnessGoal);

router.post('/trainer/:id', userController.registerPersonalTraining);


// Put routers

router.put("/updateMember/:member_id", userController.updateMember);

router.put(
  "/updateMember/paymentInfo/:member_id",
  userController.updateMemberPaymentInfo
);

router.put("/updateUser/:id", userController.updateUser);

router.put("/updateFitnessGoal/:goal_id", userController.updateFitnessGoal);

router.put("/completeFitnessGoal/:goal_id", userController.completeFitnessGoal);

// Delete routers
router.delete("/deleteFitnessGoal/:goal_id", userController.deleteFitnessGoal);

module.exports = router;

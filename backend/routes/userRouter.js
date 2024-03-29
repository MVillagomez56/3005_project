const express = require("express");
const router = express.Router();

console.log("user router started");

// The user-controller is where all the logic for modifying backend works

const userController = require("../controllers/users-controller.ts");

// Get router 
// router.get("/api/user/:id", userController.getUserById);

// router.get("/api/members", userController.getAllMembers);

// router.get("/api/member/:userid", userController.getMemberById);



// Post routers
router.post("/register", userController.register);

router.post("/login", userController.login);

// router.post("/api/addMember", userController.addMember);

router.post("/addPayment", userController.addPayment);

router.post("/addFitnessGoals/:member_id", userController.addFitnessGoals);

router.put('/updateMember/:member_id', userController.updateMember);

router.put('/updateMember/paymentInfo/:member_id', userController.updateMemberPaymentInfo);

router.get('/searchMember', userController.searchMember);

router.get('/trainers', userController.getAllTrainersWithPF);


module.exports = router;
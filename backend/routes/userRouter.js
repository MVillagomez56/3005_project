const express = require("express");
const router = express.Router();

// The user-controller is where all the logic for modifying backend works

const userController = require("../controllers/users-controller.ts");

// Get router 
// router.get("/api/user/:id", userController.getUserById);

// router.get("/api/members", userController.getAllMembers);

// router.get("/api/member/:userid", userController.getMemberById);



// Post routers
router.post("/api/register", userController.register);

router.post("/api/login", userController.login);

// router.post("/api/addMember", userController.addMember);

<<<<<<< HEAD
// router.post("/api/addPayment", userController.addPayment);

// router.post("/api/addFitnessGoal", userController.addFitnessGoal);
=======
router.post("/api/addPayment", userController.addPayment);

router.post("/api/addFitnessGoals/:member_id", userController.addFitnessGoals);

router.put('/api/updateMember/:member_id', userController.updateMember);

router.put('/api/updateMember/paymentInfo/:member_id', userController.updateMemberPaymentInfo);

>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

module.exports = router;
const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment-controller");

router.get("/getPayments", paymentController.getAllPayments);
router.get("/getPayment/:id", paymentController.getPaymentById);
router.post("/addPayment", paymentController.addPayment);
router.post("/approvePayment/:id", paymentController.approvePayment);
router.post("/declinePayment/:id", paymentController.declinePayment);

module.exports = router;
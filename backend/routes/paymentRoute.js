const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment-controller");

router.get("/getPayments", paymentController.getAllPayments);
router.get("/getPayment/:id", paymentController.getPaymentById);
router.get("/getMemberPayments/:id", paymentController.getMemberPayments);
router.post("/approvePayment/:id", paymentController.approvePayment);
router.post("/declinePayment/:id", paymentController.declinePayment);
router.delete("/cancelPayment/:id", paymentController.cancelPayment);

module.exports = router;
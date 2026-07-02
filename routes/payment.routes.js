

const express = require("express");
const { addPayment, getPayment, getAllPayments, getPaymentStat } = require("../controllers/payment.conntrollers");
const router = express.Router();

router.post("/add/:id", addPayment);
router.get("/get/:id", getPayment);
router.get("/get-all", getAllPayments);
router.get("/get-stat", getPaymentStat);

module.exports = router 
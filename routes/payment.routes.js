

const express = require("express");
const { addPayment, getPayment, getAllPayments } = require("../controllers/payment.conntrollers");
const router = express.Router();

router.post("/add/:id", addPayment);
router.get("/get/:id", getPayment);
router.get("/get-all", getAllPayments);

module.exports = router 
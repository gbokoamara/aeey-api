


const express = require("express")
const { webhook, checkPayment, checkPayout } = require("../controllers/webhook.controllers")
const router = express.Router()

router.get("/", webhook)
router.post("/check", checkPayment)
router.post("/payout", checkPayout)



module.exports = router
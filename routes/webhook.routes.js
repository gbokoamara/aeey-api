


const express = require("express")
const { webhook, checkPayment } = require("../controllers/webhook.controllers")
const router = express.Router()

router.post("/", webhook)
router.post("/check", checkPayment)



module.exports = router
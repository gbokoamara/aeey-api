
const express = require("express")
const { requestCard, getCard, getrequestedCards } = require("../controllers/card.controllers")
const router = express.Router()

router.post("/create/:id", requestCard)
router.get("/get/:id", getCard)
router.get("/get-all-request", getrequestedCards)



module.exports = router
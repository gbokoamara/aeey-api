
const express = require("express")
const { requestCard, getCard } = require("../controllers/card.controllers")
const router = express.Router()

router.post("/create/:id", requestCard)
router.get("/get/:id", getCard)



module.exports = router
const express = require("express")
const { profil, update, register, memberRequest, getUserByNumber } = require("../controllers/user.controllers");
const protect = require("../middlewares/userMiddleware")
const router = express.Router()

router.get("/profil/:id", protect, profil);
router.get("/get-by-number/:number", protect, getUserByNumber)
router.post("/update-profil/:id", protect, update);
router.post("/member-request/:id", protect, memberRequest)
router.post("/", protect, register)


module.exports = router
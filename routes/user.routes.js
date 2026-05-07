const express = require("express")
const { update, register, memberRequest } = require("../controllers/user.controllers");
const protect = require("../middlewares/userMiddleware")
const router = express.Router()

router.post("/update-profil/:id", update);
router.post("/member-request/:id", memberRequest)
router.post("/", register)


module.exports = router
const express = require("express")
const { profil, update, register, memberRequest } = require("../controllers/user.controllers");
const protect = require("../middlewares/userMiddleware")
const router = express.Router()

router.get("/profil/:id", profil);
router.post("/update-profil/:id", update);
router.post("/member-request/:id", memberRequest)
router.post("/", register)


module.exports = router
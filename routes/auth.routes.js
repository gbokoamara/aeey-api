const express = require("express");
const { login, register, password, passwordLogin, forgotPassword, resetPassword } = require("../controllers/auth.controllers");
const protect = require("../middlewares/userMiddleware")
const router = express.Router()

router.post("/login", login);
router.post("/", register)
router.put("/password/:id", protect, password)
router.post("/password-verify/:id", protect, passwordLogin)
router.put("/forgot-password/:id", protect, forgotPassword)
router.post("/reset-password",  resetPassword)


module.exports = router
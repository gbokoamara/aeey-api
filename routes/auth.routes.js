const express = require("express");
const { login, register, password, passwordLogin, forgotPassword, resetPassword } = require("../controllers/auth.controllers");
const protect = require("../middlewares/userMiddleware");
const rateLimitHelper = require("../middlewares/rateLimit");
const router = express.Router();

const windowMs = 15 * 60 * 1000
const loginMessage = "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes."
const registerMessage = "Trop de tentatives d'inscription. Veuillez réessayer dans 15 minutes."
const passMessage = "Trop de tentatives de verification PIN. Veuillez réessayer dans 15 minutes."
const forgotMessage = "Trop de tentatives de mot de passe oublié. Veuillez réessayer dans 15 minutes."
const resetMessage = "Trop de tentatives de reinitialisation. Veuillez réessayer dans 15 minutes."

router.post("/login", rateLimitHelper({windowMs, max:5, message: loginMessage}), login);
router.post("/register", rateLimitHelper({windowMs, max:5, message: registerMessage}), register)
router.put("/password/:id", rateLimitHelper({windowMs, max:5, }), protect, password)
router.post("/password-verify/:id", rateLimitHelper({windowMs, max:5, message: passMessage}), protect, passwordLogin)
router.put("/forgot-password/:id", rateLimitHelper({windowMs, max:5, message: forgotMessage}), protect, forgotPassword)
router.post("/reset-password", rateLimitHelper({windowMs, max:5, message: resetMessage}),  resetPassword)


module.exports = router
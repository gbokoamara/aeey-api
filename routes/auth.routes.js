const express = require("express");
const { login, register, password, passwordLogin } = require("../controllers/auth.controllers");
const router = express.Router()

router.post("/login", login);
router.post("/", register)
router.put("/password/:id", password)
router.post("/password-verify/:id", passwordLogin)


module.exports = router
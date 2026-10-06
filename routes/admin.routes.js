const express = require("express");
const protect = require("../middlewares/userMiddleware")
const adminController = require("../controllers/admin.controllers");
const rateLimitHelper = require("../middlewares/rateLimit");
const router = express.Router()

router.get("/manage",   adminController.getManagement)
router.get("/get-moderator",  protect, adminController.getModerator)
router.get("/get-moderators",  protect, adminController.getModerators)
router.post("/manage", rateLimitHelper(), protect, adminController.manage)
router.post("/add-moderator", rateLimitHelper(), protect, adminController.createModerator);
router.put("/remove-moderator", rateLimitHelper(), protect, adminController.removeModerator)


module.exports = router


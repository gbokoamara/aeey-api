const express = require("express");
const protect = require("../middlewares/userMiddleware")
const adminController = require("../controllers/admin.controllers")
const router = express.Router()

router.post("/add-moderator", protect, adminController.createModerator);
router.get("/get-moderator", protect, adminController.getModerator)
router.get("/get-moderators", protect, adminController.getModerators)
router.put("/remove-moderator", protect, adminController.removeModerator)
router.post("/manage", protect, adminController.manage)
router.get("/manage", adminController.getManagement)


module.exports = router




const express = require("express");
const router = express.Router();
const {
  getMember,
  getMembers,
  getPendingMember,
  updateMember,
  deleteMember,
} = require("../controllers/member.controllers");
const protect = require("../middlewares/userMiddleware");

// router.post("/add", addMember)
router.put("/update/:id", protect, updateMember);
router.get("/get-member/:id", protect, getMember);
router.get("/get-pending-members", protect, getPendingMember);
router.get("/get-all-members", protect, getMembers);
router.delete("/delete/:id", protect, deleteMember);

module.exports = router;

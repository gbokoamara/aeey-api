

const express = require("express");
const router = express.Router();
const {
  getMember,
  getMembers,
  getPendingMember,
  updateMember,
  deleteMember,
} = require("../controllers/member.controllers");

// router.post("/add", addMember)
router.put("/update/:id", updateMember);
router.get("/get-member/:id", getMember);
router.get("/get-pending-members", getPendingMember);
router.get("/get-all-members", getMembers);
router.delete("/delete/:id", deleteMember);

module.exports = router;

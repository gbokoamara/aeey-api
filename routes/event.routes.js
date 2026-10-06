const express = require("express");
const {
  addEvent,
  getAllActiveEvents,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
} = require("../controllers/event.controllers");
const protect = require("../middlewares/userMiddleware");
const rateLimitHelper = require("../middlewares/rateLimit");
const router = express.Router();

// GET
router.get("/get-all-active-events", getAllActiveEvents);
router.get("/get-all-events", getAllEvents);
router.get("/get-event/:id", getEvent);

// ADD
router.post("/add", rateLimitHelper(), protect, addEvent);
router.put("/update/:id", rateLimitHelper(), protect, updateEvent);
router.put("/publish/:id", rateLimitHelper(), protect, publishEvent);
// DELETE
router.delete("/delete/:id", rateLimitHelper(), protect, deleteEvent);

module.exports = router;

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
const router = express.Router();

// GET
router.get("/get-all-active-events", getAllActiveEvents);
router.get("/get-all-events", getAllEvents);
router.get("/get-event/:id", getEvent);

// ADD
router.post("/add", addEvent);
router.put("/update/:id", updateEvent);
router.put("/publish/:id", publishEvent);
// DELETE
router.delete("/delete/:id", deleteEvent);

module.exports = router;

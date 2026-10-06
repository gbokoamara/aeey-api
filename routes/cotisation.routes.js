
const express = require("express")
const cotisationController = require("../controllers/cotisation.controllers")
const protect = require("../middlewares/userMiddleware")
const rateLimitHelper = require("../middlewares/rateLimit")
const router = express.Router()
 
router.get("/getcotisations", cotisationController.getCotisations)
router.get("/getcotisation/:id", cotisationController.getCotisation)
router.post("/add", rateLimitHelper(), protect, cotisationController.addCotisation)
router.put("/update/:id", rateLimitHelper(), protect, cotisationController.updateCotisation)
router.delete("/delete/:id", rateLimitHelper(), protect, cotisationController.deleteCotisation)



module.exports = router
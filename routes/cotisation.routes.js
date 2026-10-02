
const express = require("express")
const cotisationController = require("../controllers/cotisation.controllers")
const protect = require("../middlewares/userMiddleware")
const router = express.Router()
 
router.post("/add", protect, cotisationController.addCotisation)
router.put("/update/:id", protect, cotisationController.updateCotisation)
router.get("/getcotisation/:id", cotisationController.getCotisation)
router.get("/getcotisations", cotisationController.getCotisations)
router.delete("/delete/:id", protect, cotisationController.deleteCotisation)



module.exports = router
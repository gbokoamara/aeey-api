
const express = require("express")
const { addCotisation, updateCotisation, getCotisation, getCotisations, deleteCotisation } = require("../controllers/cotisation.controllers")
const router = express.Router()
 
router.post("/add", addCotisation)
router.put("/update/:id", updateCotisation)
router.get("/getcotisation/:id", getCotisation)
router.get("/getcotisations", getCotisations)
router.delete("/delete/:id", deleteCotisation)



module.exports = router
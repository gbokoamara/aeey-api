


const express = require("express");
const { uploadImage, uploadDocument } = require("../controllers/cloudinary.controllers");
const upload = require("../middlewares/upload");
const router = express.Router()

router.post("/image", upload.single("file"), uploadImage); // 
router.post("/document", upload.single("file"), uploadDocument)



module.exports = router
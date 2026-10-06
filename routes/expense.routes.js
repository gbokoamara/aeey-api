

const express = require("express")
const router = express.Router()
const {
    addExpense,
    updateExpense,
    getExpense,
    getExpenses,
    deleteExpense,
    approveExpense,
    rejectExpense,
    getApprovedExpenses,
} = require("../controllers/expense.controllers")
const protect = require("../middlewares/userMiddleware")
const rateLimitHelper = require("../middlewares/rateLimit")

router.get("/get-expense/:id", getExpense )
router.get("/get-all-expenses", getExpenses )
router.get("/get-approved-expenses", getApprovedExpenses )

router.post("/add/:id", rateLimitHelper(), protect, addExpense)
router.put("/update/:id", rateLimitHelper(), protect, updateExpense)
router.delete("/delete/:id", rateLimitHelper(), protect, deleteExpense)

router.post("/approve/:id", rateLimitHelper(), protect, approveExpense) 
router.post("/reject/:id", rateLimitHelper(), protect, rejectExpense) 


module.exports = router
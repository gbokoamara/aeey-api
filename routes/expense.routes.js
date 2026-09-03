

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
} = require("../controllers/expense.controllers")
const protect = require("../middlewares/userMiddleware")

router.post("/add/:id", protect, addExpense)
router.put("/update/:id", protect, updateExpense)
router.get("/get-expense/:id", getExpense )
router.get("/get-all-expenses", getExpenses )
router.delete("/delete/:id", protect, deleteExpense)

router.post("/approve/:id", protect, approveExpense) 
router.post("/reject/:id", protect, rejectExpense) 


module.exports = router
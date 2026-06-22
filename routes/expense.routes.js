

const express = require("express")
const router = express.Router()
const {
    addExpense,
    updateExpense,
    getExpense,
    getExpenses,
    deleteExpense
} = require("../controllers/expense.controllers")

router.post("/add", addExpense)
router.put("/update/:id", updateExpense)
router.get("/get-expense/:id", getExpense )
router.get("/get-all-expenses", getExpenses )
router.delete("/delete/:id", deleteExpense)


module.exports = router
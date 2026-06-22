const prisma = require("../utils/prisma")

module.exports = {
    addExpense: async (addPayload) => {
        try {
            const expense = await prisma.expense.create(
                {
                    data: addPayload
                }
            )
            return expense
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    updateExpense: async (expenseId, updatePayload) => {
        try {
            const expense = await prisma.expense.update(
                {
                    where: {id: expenseId},
                    data: updatePayload
                }
            )
            return expense
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    deleteExpense: async (expenseId) => {
        try {
            await prisma.expense.delete(
                { where: {id: expenseId}, }
            )
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getAllExpenses: async () => {
        try {
            const expenses = await prisma.expense.findMany(
            )
            return expenses
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getExpense: async (expenseId) => {
        try {
            const expense = await prisma.expense.findUnique(
                {where: {id: expenseId}}
            )
            return expense
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },
}
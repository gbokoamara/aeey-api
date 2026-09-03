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

    getApprovalExpense: async (expenseId) => {
        try {
            const expense = await prisma.expense.findUnique({
                where: {id: expenseId},
                include: { approvals: true}
            })
            return expense
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },
    
    approveExpense: async (expenseId, moderatorId) => {
        try {
        const vote = await prisma.expenseApproval.upsert({
            where: {
                expenseId_moderatorId: {
                expenseId,
                moderatorId,
                },
            },
            update: {
                status: "APPROVED",
                approvedAt: new Date(),
            },
            create: {
                expenseId,
                moderatorId,
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });
        return vote;
        } catch (error) {
            console.error("erreur de validation de depense", error.message)
            throw error
        }
    },
    rejectExpense: async (expenseId, moderatorId) => {
        try {
            const vote = await prisma.expenseApproval.upsert({
            where: {
                expenseId_moderatorId: {
                expenseId,
                moderatorId,
                },
            },
            update: {
                status: "REJECTED",
                approvedAt: new Date(),
            },
            create: {
                expenseId,
                moderatorId,
                status: "REJECTED",
                approvedAt: new Date(),
            },
        });
        return vote;
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getExpenseApprovals: async (expenseId) => {
        try {
            const expense = await prisma.expenseApproval.findMany({
                where: {
                    id: expenseId,
                },
            })
            return expense
        } catch (error) {
            console.error("erreur de comptage des depenes approvées", error.message)
            throw error
        }
    },

    countExpenseApprovals: async (expenseId) => {
        try {
            const approveCount = await prisma.expenseApproval.count({
                where: {
                    expenseId: expenseId,
                    status: "APPROVED"
                },
            })
            return approveCount
        } catch (error) {
            console.error("erreur de comptage des depenes approvées", error.message)
            throw error
        }
    },

    countRejectedExpense: async (expenseId) => {
        try {
            const rejectCount = await prisma.expenseApproval.count({
                where: {
                    expenseId: expenseId,
                    status:"REJECTED"
                },
            })
            return rejectCount
        } catch (error) {
            console.error("erreur de comptage des depenes rejectées", error.message)
            throw error
        }
    },
}
const prisma = require("../utils/prisma")


module.exports = {
    addPayment: async (paymentPayload) => {
        try {
            const payment = await prisma.payment.create({data: paymentPayload})
            return payment
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getPayment: async (PaymentId) => {
        try {
            const payment = await prisma.payment.findUnique(
                {where: {id: PaymentId}}
            )
            return payment
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getAllPayments: async () => {
        try {
            const payments = await prisma.payment.findMany()
            return payments
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getPaymentStat: async () => {
    try {
        const stats = await prisma.payment.aggregate({
            _sum: {
                amount: true
            },
            _count: {
                id: true
            }
        })

        return {
            totalAmount: stats._sum.amount || 0,
            totalPayments: stats._count.id
        }
    } catch (error) {
        console.error(error)
        throw error
    }
},
}
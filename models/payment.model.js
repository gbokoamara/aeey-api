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
}
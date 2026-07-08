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
    updatePayment: async (updatePayload, paymentId) => {
        try {
            const payment = await prisma.payment.findFirst({
            where: {
                id: paymentId,
                status: "PENDING"
            }
            });
            // console.log("payment on model :=>", payment);

            if (!payment) { throw new Error("Aucun paiement en attente trouvé."); }

            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: updatePayload
            });
            return updatedPayment
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
            const payments = await prisma.payment.findMany({
                where: {
                status:  "SUCCESS"
            },
            })
            return payments
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getUserPayments: async (userId) => {
        try {
            const payments = await prisma.payment.findMany({
                where: {
                userId: userId,
                status:  "SUCCESS"
            },
            })
            return payments
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getPaymentStat: async () => {
    try {
        const stats = await prisma.payment.aggregate({
            where: {
                status:  "SUCCESS"
            },
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
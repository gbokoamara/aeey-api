const prisma = require("../utils/prisma");
const adminModel = require("./admin.model");
const cardModel = require("./card.model");
const donationModel = require("./donation.model");
const eventModel = require("./event.model");
const userModel = require("./user.model");

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
            const [ payments, totalAmount, total, 
                    cardTotalAmount, evntTotalAmount, 
                    donTotalAmount, withdrawTotalAmount, 
                    cotisationTotalAmount, terceTotalAmount,
                    serviceTotalAmount ] =
                await Promise.all([
                    prisma.payment.findMany({where: {status:  "SUCCESS"}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS"}, _sum:{amount:true}}),
                    prisma.payment.count({where: {status: "SUCCESS"}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "CARTE"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "EVENT"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "DON"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "WITHDRAW"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "COTISATION"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "COTISATION_TIERCE"}, _sum:{amount:true}}),
                    prisma.payment.aggregate({where: {status: "SUCCESS", type: "SERVICE"}, _sum:{amount:true}}),
                ])
            const paymentStats = {
                totalAmount: totalAmount._sum.amount || 0 ,
                total,
                cardTotalAmount: cardTotalAmount._sum.amount || 0, 
                evntTotalAmount: evntTotalAmount._sum.amount || 0, 
                donTotalAmount: donTotalAmount._sum.amount || 0, 
                withdrawTotalAmount: withdrawTotalAmount._sum.amount || 0, 
                cotisationTotalAmount: cotisationTotalAmount._sum.amount || 0, 
                terceTotalAmount: terceTotalAmount._sum.amount || 0,
                serviceTotalAmount: serviceTotalAmount._sum.amount || 0,
            }
            return {payments, paymentStats}
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
    processPaymentResult : async (fusionPayment) => {
        try {
            const payment = fusionPayment?.payment || fusionPayment;
            const personalInfo = payment?.personal_Info?.[0];

            const paymentId = personalInfo?.paymentId;
            const cotisationName = personalInfo?.cotisationName;
            const phoneNumber = payment?.numeroSend;


            if (!paymentId) {
            throw new Error("paymentId introuvable dans personal_Info");
            }

            // ==========================================
            // VALIDATION DU MEMBRE
            // ==========================================

            if (["Adhésion", "Droit d'adhésion"].includes(cotisationName)) {

                if (!phoneNumber) {
                    throw new Error("Numéro de téléphone du membre introuvable");
                };

                const user = await userModel.getUserByNumber(phoneNumber) ;

                if (!user) {
                    throw new Error("Membre introuvable !");
                };

                updatedUser = await userModel.update(user.id, { isVerify : true, memberStatus: "APPROVED"}) ;
            }

            // ==========================================
            // RÉCUPÉRER LE PAIEMENT AEEY
            // ==========================================

            const myPayment = await module.exports.getPayment(paymentId);

            if (!myPayment) {
            throw new Error("Paiement introuvable dans AEEY");
            }

            // Déjà traité
            if (myPayment.status === "SUCCESS") {
            return {
                success: true,
                alreadyProcessed: true,
                payment: myPayment,
            };
            }

            // ==========================================
            // SI PAIEMENT NON PAYÉ
            // ==========================================

            if (payment?.statut !== "paid") {
            return {
                success: false,
                paid: false,
                status: payment?.statut,
                payment: myPayment,
            };
            }

            const montant = myPayment.amount;
            const method = payment?.moyen;

            // ==========================================
            // METTRE LE PAYMENT AEEY EN SUCCESS
            // ==========================================

            const updatePayload = {
            status: "SUCCESS",
            amount: montant,
            method,
            };

            const updatePayment = await module.exports.updatePayment(
            updatePayload,
            myPayment.id
            );
            
            const paymentData = { updatePayment,};

            // Mise à jour des stats
            const stats = await adminModel.updateTreasury(myPayment.amount)

            // ==========================================
            // TRAITEMENT SELON LE TYPE
            // ==========================================

            switch (personalInfo?.type) {

            case "carte": {
                const cardUpdatePayload = {
                status: "VALIDEE",
                };

                const card = await cardModel.update(
                cardUpdatePayload,
                personalInfo.cardId
                );

                paymentData.card = card;
                break;
            }

            case "guest": {
                const donUpdatePayload = {
                status: true,
                targetAmount: montant,
                };

                const donation = await donationModel.updateDonation(
                donUpdatePayload,
                myPayment.donationId
                );

                paymentData.donation = donation;
                break;
            }

            case "event": {
                const event = await eventModel.getEvent(myPayment.eventId);

                const eventUpdatePayload = {
                collectedAmount:
                    (event?.collectedAmount ?? 0) + montant,

                participantCount:
                    (event?.participantCount ?? 0) + 1,
                };

                const eventUpdated = await eventModel.updateEvent(
                myPayment.eventId,
                eventUpdatePayload
                );

                paymentData.eventUpdated = eventUpdated;
                break;
            }

            case "member": {
                // traitement cotisation
                break;
            }
            }

            return {
            success: true,
            paid: true,
            stats,
            payment: updatePayment,
            paymentData,
            };

        } catch (error) {
            console.error("processPaymentResult:", error);
            throw error;
        }
    }
}
const prisma = require("../utils/prisma")

module.exports = {
    addEvent: async (addPayload) => {
        try {
            const event = await prisma.event.create(
                {
                    data: addPayload
                }
            )
            return event
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    updateEvent: async (eventId, eventUpdatePayload) => {
        try {
            const event = await prisma.event.update(
                {
                    where: {id: eventId},
                    data: eventUpdatePayload
                }
            )
            return event
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    deleteEvent: async (eventId) => {
        try {
            await prisma.event.delete(
                { where: {id: eventId}, }
            )
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getAllActiveEvents: async () => {
        try {
            const events = await prisma.event.findMany(
                {where: {isPublished: true}}
            )
            const [total, totalAmount, totalCollected, totalParticipant] = await Promise.all([
                prisma.event.count({where:{isPublished: true}}),
                prisma.event.aggregate({_sum: {amount: true}, where:{isPublished: true}}),
                prisma.event.aggregate({_sum: {collectedAmount: true}}),
                prisma.event.aggregate({_sum: {participantCount: true}}),

            ])
            const eventStats = {
                total,
                totalAmount: totalAmount._sum.amount || 0,
                totalCollected: totalCollected._sum.collectedAmount || 0,
                totalParticipant: totalParticipant._sum.participantCount || 0,
            }
            return {events, eventStats}
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getAllEvents: async () => {
        try {
            const event = await prisma.event.findMany(
            )
            return event
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },

    getEvent: async (eventId) => {
        try {
            const event = await prisma.event.findUnique(
                {where: {id: eventId}}
            )
            return event
        } catch (error) {
            console.error("erreur d'ajout d'evemenent", error.message)
            throw error
        }
    },
}
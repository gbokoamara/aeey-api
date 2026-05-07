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

    updateEvent: async (eventId, updatePayload) => {
        try {
            const event = await prisma.event.update(
                {
                    where: {id: eventId},
                    data: updatePayload
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
            const event = await prisma.event.findMany(
                {where: {isPublished: true}}
            )
            return event
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
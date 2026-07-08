const prisma = require("../utils/prisma")


module.exports = {
    create: async (cotisationPayload) => {
        const cotisation = await prisma.cotisation.create({
            data: cotisationPayload
        })
        return cotisation ;
    },

    update: async (updatePayload, cotisationId) => {
        const updateCotisation = await prisma.cotisation.update({
            where: {id: cotisationId},
            data: updatePayload,
        })
        return updateCotisation ;
    },

    getcotisationIdById: async (cotisationId) => {
        
        const cotisation = await prisma.cotisation.findUnique({
           where: {id: cotisationId},
           include: { payments: true}
        })
        return cotisation ;
    },


    getCotisations: async() => {
        const cotisations = await prisma.cotisation.findMany({where:{active: true}});
        return cotisations;
    },

    deleteCotisation: async (cotisationId) => {
        try {
            await prisma.cotisation.delete(
                { where: {id: cotisationId}, }
            )
        const cotisations = await prisma.cotisation.findMany({where:{active: true}})
        return cotisations
        } catch (error) {
            console.error("erreur de suppression de la cautisation", error.message)
            throw error
        }
    }
}
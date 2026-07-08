// const { logData } = require("../../client/src/utils/console");
const prisma = require("../utils/prisma")


module.exports = {
    create: async (createPayload) => {
        const card = await prisma.memberCard.create({
            data: createPayload
        })
        return card ;
    },

    update: async (cardUpdatePayload, cardId) => {
        const updateCard = await prisma.memberCard.update({
            where: {id: cardId},
            data: cardUpdatePayload,
        })
        return updateCard ;
    },

     getCardByUserId: async (userId) => {
            // logData("userId ...", userId)
        
        const card = await prisma.memberCard.findUnique({
           where: {userId: userId},
           include: { payments: true}
        })
        return card ;
    },

    getCardByCardId: async (CardId) => {
        
        const card = await prisma.memberCard.findUnique({
           where: {id: CardId},
           include: { payments: true}
        })
        return card ;
    },



    getRequestedCars: async() => {
        const cards = await prisma.memberCard.findMany({
            where:{status: "EN_ATTENTE"}
        });
        return cards;
    }
}
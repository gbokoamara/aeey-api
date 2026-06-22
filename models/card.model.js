const { logData } = require("../../client/src/utils/console");
const prisma = require("../utils/prisma")


module.exports = {
    create: async (createPayload) => {
        const card = await prisma.memberCard.create({
            data: createPayload
        })
        return card ;
    },

     getCardByUserId: async (userId) => {
            logData("userId ...", userId)
        
        const card = await prisma.memberCard.findUnique({
           where: {userId: userId},
        //    include: { user: true}
        })
        return card ;
    }
}
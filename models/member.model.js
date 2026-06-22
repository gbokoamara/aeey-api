const prisma = require("../utils/prisma")


module.exports = {
  getMember: async (userId) => {
    try {
        const user = await prisma.user.findUnique(
            {where: {id: userId}}
        )
        return user
    } catch (error) {
        console.error("error", error.message)
        throw error
    }
  },

  getMembers: async () => {
    try {
        const members = await prisma.user.findMany({
            where: {isVerify: true}
        })
        return members;
    } catch (error) {
        console.error("error", error.message)
        throw error
    }
  },

  getPendingMember: async  () => {
    try {
        const pendingMenber = await prisma.user.findMany(
            {where: {isVerify: false}}
        )
        return pendingMenber;
    } catch (error) {
        console.error("error", error.message)
        throw error
    }
  },

  updateMember: async (userId ) => {
    try {
        await prisma.user.update(
            {where: {id: userId}}
        )
    } catch (error) {
        console.error("error", error.message)
        throw error
    }
  },

  deleteMember: async (userId) => {
    try {
        await prisma.user.delete(
            {where: {id: userId}}
        )
    } catch (error) {
        console.error("error", error.message)
        throw error
    }
  },

}
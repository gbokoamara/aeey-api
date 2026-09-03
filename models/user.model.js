// const { logData } = require("../../client/src/utils/console");
const prisma = require("../utils/prisma");

module.exports = {
  getProfil: async (id) => {
    try {
      const user = await prisma.user.findFirst({
      where:{id},
      include:{
        payments: {where: {  status: "SUCCESS"},},
        memberCard: true,
        memberCotisations: true,
        paidCotisations: true
      }
    })
    return user;
    } catch (error) {
      console.error("erreur de mise à jour de l'utilisateur", error.message);
      throw error;
    }
  },

  getUser: async (id) => {
      // logData("id in getuser model", id)
    try {
      const user = await prisma.user.findFirst({
      where:{id},
    })
    return user;
    } catch (error) {
      console.error("erreur de mise à jour de l'utilisateur", error.message);
      throw error;
    }
  },

  getModerators: async () => {
    try {
      const moderators = await prisma.user.findMany({
      where:{role: {in:["ADMIN", "MODERATOR"]}},
      select:{ id: true, email:true, role:true, firstName:true, }
    })
    return moderators;
    } catch (error) {
      console.error("erreur de recupération des moderateurs", error.message);
      throw error;
    }
  },

  getModerator: async (id) => {
    try {
      const moderator = await prisma.user.findFirst({
      where:{id},
      select:{ id: true, email:true, role:true, firstName:true, }
    })
    return moderator;
    } catch (error) {
      console.error("erreur de recupération des moderateurs", error.message);
      throw error;
    }
  },

  getInitiator: async (id) => {
    try {
      const initiator = await prisma.user.findFirst({
      where:{id},
      select:{ id: true, email:true, role:true, firstName:true, }
    })
    return initiator;
    } catch (error) {
      console.error("erreur de recupération de l'initiateur", error.message);
      throw error;
    }
  },

  update: async (id, data) => {
      // logData("data in update model", data)
    try {
      const updatedUser = await prisma.user.update({
      where:{id},
      data: data
    })
    return updatedUser;
    } catch (error) {
      console.error("erreur de mise à jour de l'utilisateur", error.message);
      throw error;
    }
  },

  getUserByNumber: async (number) => {
    
    try {
      const user = await prisma.user.findFirst({where: {number: number}})
      return user;
    } catch (error) {
      console.error("erreur de recuperation de l'utilisateur par numero",error.message)
      throw error
    }

  },

  getModeratorVote: async (expenseId, moderatorId) => {
    try {
      const existingVote  = await prisma.expenseApproval.findUnique({
        where: {
          expenseId_moderatorId: {
            expenseId,
            moderatorId,
          },
        },
    });
    return existingVote
    } catch (error) {
      console.error("erreur de recuperation du vote", error.message)
      throw error
    }
  },

  getTotalModerator : async () => {
        try {
            const totalModerators = await prisma.user.count({
                where: {
                    role: {in: ["ADMIN", "MODERATOR"]}
                },
            })
            return totalModerators
        } catch (error) {
            console.error("erreur de comptage des moderateurs", error.message)
            throw error
        }
    },
    
}
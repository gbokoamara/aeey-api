// const { logData } = require("../../client/src/utils/console");
const prisma = require("../utils/prisma");

module.exports = {
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
    
}
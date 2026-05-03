const prisma = require("../utils/prisma");

module.exports = {
  login: async (number) => {
    try {
      const user = await prisma.user.findUnique({ where: { number } });
      return user;
    } catch (error) {
      console.error("login error", error.message);
      throw error;
    }
  },

  register: async (data) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          number: data.number,
        },
      });
      return user;
    } catch (error) {
      console.error("login error", error.message);
      throw error;
    }
  },

  getUser: async (id) => {
    try {
      const user = await prisma.user.findUnique({where:{id}})
      return user
    } catch (error) {
      console.error("utilisateur introuvable", error.message);
      throw error;
    }
  },

  updateUser: async (id, data) => {
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

  createAdmin: async (data) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          number: data.number,
          lastName: data.lastName,
          role: "ADMIN",
        },
      });
      return user;
    } catch (error) {
      console.error("login error", error.message);
      throw error;
    }
  },

  createModerator: async (data) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          number: data.number,
          lastName: data.lastName,
          role: "MODERATOR",
        },
      });
      return user;
    } catch (error) {
      console.error("login error", error.message);
      throw error;
    }
  },
};

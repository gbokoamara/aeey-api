const { errorMonitor } = require("nodemailer/lib/xoauth2");
const prisma = require("../utils/prisma");

module.exports = {

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
  
  getFee: async () => {
        try {
            const treasury = await prisma.treasury.findFirst()
            return treasury
        } catch (error) {
            console.error(error)
            throw error
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

  management: async (data) => {
    try {
      let management = {}
      const treasury = await prisma.treasury.findFirst();

      if (!treasury) {
        management = await prisma.treasury.create({data})
      } else {
        management = await prisma.treasury.update({
          where:{ id: treasury.id},
          data,
        })
      }

    return management;

    } catch (error) {
      console.error("erreur de mise à jour de l'utilisateur", error.message);
      throw error;
    }
  },

  updateTreasury: async (amount) => {
    try {
      const treasury = await prisma.treasury.findFirst({select: {id:true, balance: true}});
      if (!treasury) { throw new error("Trésorerie introuvable") }
      const balance = treasury.balance;
      const newBalance = balance + amount;
      
      const updatedTreasuary = prisma.treasury.update({
        where: {id: treasury.id},
        data: {balance: newBalance}
      })
      return updatedTreasuary;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

    decrementBalance: async (amount) => {
    try {
      const treasury = await prisma.treasury.findFirst({select: {id:true, balance: true}});
      if (!treasury) { throw new error("Trésorerie introuvable") }
      const balance = treasury.balance;
      const newBalance = balance - amount;
      
      const updatedTreasuary = prisma.treasury.update({
        where: {id: treasury.id},
        data: {balance: newBalance}
      })
      return updatedTreasuary;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  getManagement: async () => {
    try {

      let treasury = await prisma.treasury.findFirst();
      if (!treasury) {
        return ;
      }
      const balance = treasury.balance;
      const initialBalance = treasury.initialBalance;
      const solde = balance + initialBalance ;
      treasury = {
        ...treasury,
        solde
      }
      return treasury;

    } catch (error) {
      console.error("erreur de mise à jour de l'utilisateur", error.message);
      throw error;
    }
  },

  
};

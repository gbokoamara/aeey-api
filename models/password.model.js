const prisma = require("../utils/prisma");

const createPasswordReset = async ({
  userId,
  token,
  passwordHash,
  expiresAt,
}) => {
  try {
    return await prisma.passwordReset.create({
      data: {
        userId,
        token,
        passwordHash,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};

const getPasswordResetByToken = async (token) => {
  try {
    return await prisma.passwordReset.findUnique({
      where: {
        token,
      },
    });
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};

const deletePasswordReset = async (id) => {
  try {
    return await prisma.passwordReset.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};

const deleteUserPasswordResets = async (userId) => {
  try {
    return await prisma.passwordReset.deleteMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};

const updatePassword = async (userId, passwordHash) => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      },
    });
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};

module.exports = {
  updatePassword,
  createPasswordReset,
  deletePasswordReset,
  getPasswordResetByToken,
  deleteUserPasswordResets,
};

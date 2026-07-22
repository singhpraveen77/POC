import prisma from "../../config/prisma.js";

export const getDbRefreshToken = (tokenHash) => {
  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
};
export const deleteRefreshToken = (tokenHash) => {
  return prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });
};

export const createRefreshToken =(data)=>{// data must have userId , tokenhash ,expiresAt,
    return prisma.refreshToken.create({
        data
    })
}

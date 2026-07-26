import prisma from "../../config/prisma.js";

export const searchUsers = (query, excludeId) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } }
      ],
      isVerified:true,
      
      id: { not: excludeId }
    },
    take: 10,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profileImage: true
    }
  });
};

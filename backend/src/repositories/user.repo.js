import prisma from "../../config/prisma.js";

export const findByEmail = (email)=>{
    return prisma.user.findUnique({
        where:{
            email
        }
    });
};

export const findById = (id)=>{
    return prisma.user.findUnique({
        where:{
            id
        }
    });
};

export const findByUsername = (username)=>{
    return prisma.user.findUnique({
        where:{
            username
        }
    });
};

export const createUser = (data)=>{
    return prisma.user.create({
        data
    });
};

export const updateUser= (id,data)=>{
    return prisma.user.update({
        where:{
            id
        },
        data,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
    });

};

export const getOtp=  (id)=>{
    return prisma.user.findUnique({
        where:{
            id
        },
        select:{
            emailVerificationToken:true,
            emailVerificationExpire:true
        }

    })
}

export const getProfileById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      isVerified: true,
      createdAt: true,

      memberships: {
        take: 5,
        orderBy: {
          joinedAt: "desc",
        },
        select: {
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },

      boardsCreated: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },

      tasksCreated: {
        select: {
          id: true,
        },
      },

      assignedTasks: {
        take: 5,
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          updatedAt: true,
        },
      },
    },
  });
};


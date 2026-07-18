import prisma from "../../config/prisma.js";

export const createWorkspace = (data) => {
  return prisma.workspace.create({
    data
  });
};

export const getWorkspacesByUserId = (userId) => {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, username: true, email: true }
          }
        }
      },
      boards: {
        orderBy: { position: "asc" }
      }
    }
  });
};

export const getWorkspaceById = (id) => {
  return prisma.workspace.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, username: true, email: true }
          }
        }
      },
      boards: true
    }
  });
};

export const getWorkspaceBySlug = (slug) => {
  return prisma.workspace.findUnique({
    where: { slug }
  });
};

export const updateWorkspace = (id, data) => {
  return prisma.workspace.update({
    where: { id },
    data
  });
};

export const deleteWorkspace = (id) => {
  return prisma.workspace.delete({
    where: { id }
  });
};

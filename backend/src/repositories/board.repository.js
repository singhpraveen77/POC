import prisma from "../../config/prisma.js";

export const createBoard = (data) => {
  return prisma.board.create({
    data
  });
};

export const getBoardsByWorkspaceId = (workspaceId) => {
  return prisma.board.findMany({
    where: { workspaceId },
    orderBy: { position: "asc" }
  });
};

export const getBoardById = (id) => {
  return prisma.board.findUnique({
    where: { id },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" }
          }
        }
      }
    }
  });
};

export const updateBoard = (id, data) => {
  return prisma.board.update({
    where: { id },
    data
  });
};

export const deleteBoard = (id) => {
  return prisma.board.delete({
    where: { id }
  });
};

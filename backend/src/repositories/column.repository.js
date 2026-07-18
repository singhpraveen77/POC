import prisma from "../../config/prisma.js";

export const createColumn = (data) => {
  return prisma.column.create({
    data,
    include: {
      tasks: true
    }
  });
};

export const getColumnById = (id) => {
  return prisma.column.findUnique({
    where: { id },
    include: {
      board: true,
      tasks: true
    }
  });
};

export const updateColumn = (id, data) => {
  return prisma.column.update({
    where: { id },
    data
  });
};

export const deleteColumn = (id) => {
  return prisma.column.delete({
    where: { id }
  });
};

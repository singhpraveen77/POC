import prisma from "../../config/prisma.js";

export const createTask = (data) => {
  return prisma.task.create({
    data,
    include: {
      assignee: {
        select: { id: true, name: true, username: true }
      }
    }
  });
};

export const getTaskById = (id) => {
  return prisma.task.findUnique({
    where: { id },
    include: {
      column: true,
      assignee: {
        select: { id: true, name: true, username: true }
      }
    }
  });
};

export const updateTask = (id, data) => {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      assignee: {
        select: { id: true, name: true, username: true }
      }
    }
  });
};

export const deleteTask = (id) => {
  return prisma.task.delete({
    where: { id }
  });
};

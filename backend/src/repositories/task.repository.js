import prisma from "../../config/prisma.js";

export const createTask = (data) => {
  const { columnId, assigneeId, createdById, ...rest } = data;

  const prismaData = {
    ...rest,
    column: { connect: { id: columnId } },
    creator: { connect: { id: createdById } },
  };

  if (assigneeId) {
    prismaData.assignee = { connect: { id: assigneeId } };
  }

  return prisma.task.create({
    data: prismaData,
    include: {
      assignee: {
        select: { id: true, name: true, username: true, profileImage: true }
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
  const { columnId, isDnd, assigneeId, ...rest } = data;

  const prismaData = { ...rest };

  if (columnId) {
    prismaData.column = { connect: { id: columnId } };
  }

  if (assigneeId !== undefined) {
    prismaData.assignee = assigneeId
      ? { connect: { id: assigneeId } }
      : { disconnect: true };
  }

  return prisma.task.update({
    where: { id },
    data: prismaData,
    include: {
      assignee: {
        select: { id: true, name: true, username: true, profileImage: true }
      }
    }
  });
};

export const deleteTask = (id) => {
  return prisma.task.delete({
    where: { id }
  });
};
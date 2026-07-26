import prisma from "../../config/prisma.js";

export const findMemberById = (workspaceId, userId) => {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
};

export const findAllMembers = (workspaceId) => {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: { id: true, name: true, username: true, email: true, profileImage: true }
      }
    }
  });
};

export const updateMemberRole = (workspaceId, userId, role) => {
  return prisma.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId, userId } },
    data: { role }
  });
};

export const deleteMember = (workspaceId, userId) => {
  return prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
};

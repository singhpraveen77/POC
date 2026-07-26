import prisma from "../../config/prisma.js";

export const createInvite = (data) => {
  return prisma.workspaceInvite.create({ data });
};

export const findInviteById = (id) => {
  return prisma.workspaceInvite.findUnique({ where: { id } });
};

export const findPendingInvite = (workspaceId, invitedUserId) => {
  return prisma.workspaceInvite.findFirst({
    where: { workspaceId, invitedUserId, status: "PENDING" }
  });
};

export const updateInviteStatus = (id, status) => {
  return prisma.workspaceInvite.update({ where: { id }, data: { status } });
};

export const findIncomingInvites = (userId) => {
  return prisma.workspaceInvite.findMany({
    where: { invitedUserId: userId, status: "PENDING" },
    include: {
      workspace: { select: { id: true, name: true } },
      invitedBy: { select: { id: true, name: true, username: true, email: true, profileImage: true } }
    }
  });
};

export const findOutgoingInvites = (workspaceId) => {
  return prisma.workspaceInvite.findMany({
    where: { workspaceId, status: "PENDING" },
    include: {
      invitedUser: { select: { id: true, name: true, username: true, email: true, profileImage: true } },
      invitedBy: { select: { id: true, name: true, username: true } }
    }
  });
};

export const acceptInviteTransaction = (inviteId, workspaceId, invitedUserId, role) => {
  return prisma.$transaction([
    prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" }
    }),
    prisma.workspaceMember.create({
      data: { workspaceId, userId: invitedUserId, role }
    })
  ]);
};

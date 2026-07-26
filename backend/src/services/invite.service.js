import { StatusCodes } from "http-status-codes";
import {
  createInvite,
  findInviteById,
  findPendingInvite,
  updateInviteStatus,
  acceptInviteTransaction,
  findIncomingInvites,
  findOutgoingInvites,
} from "../repositories/invite.repository.js";
import { findMemberById } from "../repositories/member.repository.js";
import AppError from "../utils/AppError.js";

export const sendInvite = async (userId, workspaceId, { invitedUserId, role }) => {
  const existingMember = await findMemberById(workspaceId, invitedUserId);
  if (existingMember) {
    throw new AppError("User is already a member of this workspace", StatusCodes.CONFLICT);
  }

  const existingInvite = await findPendingInvite(workspaceId, invitedUserId);
  if (existingInvite) {
    throw new AppError("A pending invite already exists for this user", StatusCodes.CONFLICT);
  }

  const invite = await createInvite({ workspaceId, invitedById: userId, invitedUserId, role });

  return invite;
};

export const acceptInvite = async (userId, inviteId) => {
  const invite = await findInviteById(inviteId);
  if (!invite) {
    throw new AppError("Invite not found", StatusCodes.NOT_FOUND);
  }

  if (invite.invitedUserId !== userId) {
    throw new AppError("Not authorized to perform this action", StatusCodes.FORBIDDEN);
  }

  if (invite.status !== "PENDING") {
    throw new AppError("Invite is no longer pending", StatusCodes.BAD_REQUEST);
  }

  const [updatedInvite, newMember] = await acceptInviteTransaction(
    inviteId,
    invite.workspaceId,
    invite.invitedUserId,
    invite.role
  );

  return { invite: updatedInvite, member: newMember };
};

export const rejectInvite = async (userId, inviteId) => {
  const invite = await findInviteById(inviteId);
  if (!invite) {
    throw new AppError("Invite not found", StatusCodes.NOT_FOUND);
  }

  if (invite.invitedUserId !== userId) {
    throw new AppError("Not authorized to perform this action", StatusCodes.FORBIDDEN);
  }

  if (invite.status !== "PENDING") {
    throw new AppError("Invite is no longer pending", StatusCodes.BAD_REQUEST);
  }

  const updatedInvite = await updateInviteStatus(inviteId, "REJECTED");

  return updatedInvite;
};

export const cancelInvite = async (userId, workspaceId, inviteId) => {
  const invite = await findInviteById(inviteId);
  if (!invite) {
    throw new AppError("Invite not found", StatusCodes.NOT_FOUND);
  }

  if (invite.workspaceId !== workspaceId) {
    throw new AppError("Not authorized to perform this action", StatusCodes.FORBIDDEN);
  }

  if (invite.status !== "PENDING") {
    throw new AppError("Invite is no longer pending", StatusCodes.BAD_REQUEST);
  }

  const updatedInvite = await updateInviteStatus(inviteId, "CANCELLED");

  return updatedInvite;
};

export const getIncomingInvites = (userId) => {
  return findIncomingInvites(userId);
};

export const getOutgoingInvites = (workspaceId) => {
  return findOutgoingInvites(workspaceId);
};

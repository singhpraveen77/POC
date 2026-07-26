import { StatusCodes } from "http-status-codes";
import * as memberRepo from "../repositories/member.repository.js";
import AppError from "../utils/AppError.js";

export const getMembers = async (workspaceId) => {
  return memberRepo.findAllMembers(workspaceId);
};

export const changeMemberRole = async (requesterId, workspaceId, targetUserId, newRole) => {
  const target = await memberRepo.findMemberById(workspaceId, targetUserId);
  if (!target) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }

  if (target.role === "OWNER") {
    throw new AppError("The workspace owner cannot be modified", StatusCodes.FORBIDDEN);
  }

  const requester = await memberRepo.findMemberById(workspaceId, requesterId);

  if (requester.role === "ADMIN" && target.role === "ADMIN") {
    throw new AppError("Admins cannot modify other admins", StatusCodes.FORBIDDEN);
  }

  const updated = await memberRepo.updateMemberRole(workspaceId, targetUserId, newRole);

  return updated;
};

export const removeMember = async (requesterId, workspaceId, targetUserId) => {
  const target = await memberRepo.findMemberById(workspaceId, targetUserId);
  if (!target) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }

  if (target.role === "OWNER") {
    throw new AppError("The workspace owner cannot be modified", StatusCodes.FORBIDDEN);
  }

  const requester = await memberRepo.findMemberById(workspaceId, requesterId);

  if (requester.role === "ADMIN" && target.role === "ADMIN") {
    throw new AppError("Admins cannot modify other admins", StatusCodes.FORBIDDEN);
  }

  await memberRepo.deleteMember(workspaceId, targetUserId);
};

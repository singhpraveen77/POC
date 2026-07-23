import { StatusCodes } from "http-status-codes";
import * as workspaceRepo from "../repositories/workspace.repository.js";
import AppError from "../utils/AppError.js";

export const createWorkspace = async (userId, data) => {
  const existing = await workspaceRepo.getWorkspaceBySlug(data.slug);
  if (existing) {
    throw new AppError("Workspace with this slug already exists", StatusCodes.BAD_REQUEST);
  }

  const workspaceData = {
    name: data.name,
    slug: data.slug,
    members: {
      create: {
        userId,
        role: "OWNER"
      }
    }
  };

  return workspaceRepo.createWorkspace(workspaceData);
};

export const getWorkspaces = async (userId) => {
  return workspaceRepo.getWorkspacesByUserId(userId);
};

export const getWorkspaceById = async (userId, workspaceId) => {
  const workspace = await workspaceRepo.getWorkspaceById(workspaceId);
  if (!workspace) {
    throw new AppError("Workspace not found", StatusCodes.NOT_FOUND);
  }

  const isMember = workspace.members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new AppError("Access denied", StatusCodes.FORBIDDEN);
  }

  return workspace;
};

export const updateWorkspace = async (userId, workspaceId, data) => {
  const workspace = await getWorkspaceById(userId, workspaceId);

  const member = workspace.members.find((m) => m.userId === userId);
  if (member.role !== "OWNER" && member.role !== "ADMIN") {
    throw new AppError("Only Owner or Admin can update the workspace", StatusCodes.FORBIDDEN);
  }

  if (data.slug && data.slug !== workspace.slug) {
    const existing = await workspaceRepo.getWorkspaceBySlug(data.slug);
    if (existing) {
      throw new AppError("Workspace with this slug already exists", StatusCodes.BAD_REQUEST);
    }
  }

  return workspaceRepo.updateWorkspace(workspaceId, data);
};

export const deleteWorkspace = async (userId, workspaceId) => {
  const workspace = await getWorkspaceById(userId, workspaceId);

  const member = workspace.members.find((m) => m.userId === userId);
  if (member.role !== "OWNER") {
    throw new AppError("Only Owner can delete the workspace", StatusCodes.FORBIDDEN);
  }

  return workspaceRepo.deleteWorkspace(workspaceId);
};

import * as workspaceRepo from "../repositories/workspace.repository.js";
import AppError from "../utils/AppError.js";

export const createWorkspace = async (userId, data) => {
  const existing = await workspaceRepo.getWorkspaceBySlug(data.slug);
  if (existing) {
    throw new AppError("Workspace with this slug already exists", 400);
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
    throw new AppError("Workspace not found", 404);
  }

  const isMember = workspace.members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new AppError("Access denied", 403);
  }

  return workspace;
};

export const updateWorkspace = async (userId, workspaceId, data) => {
  const workspace = await getWorkspaceById(userId, workspaceId);

  const member = workspace.members.find((m) => m.userId === userId);
  if (member.role !== "OWNER" && member.role !== "ADMIN") {
    throw new AppError("Only Owner or Admin can update the workspace", 403);
  }

  if (data.slug && data.slug !== workspace.slug) {
    const existing = await workspaceRepo.getWorkspaceBySlug(data.slug);
    if (existing) {
      throw new AppError("Workspace with this slug already exists", 400);
    }
  }

  return workspaceRepo.updateWorkspace(workspaceId, data);
};

export const deleteWorkspace = async (userId, workspaceId) => {
  const workspace = await getWorkspaceById(userId, workspaceId);

  const member = workspace.members.find((m) => m.userId === userId);
  if (member.role !== "OWNER") {
    throw new AppError("Only Owner can delete the workspace", 403);
  }

  return workspaceRepo.deleteWorkspace(workspaceId);
};

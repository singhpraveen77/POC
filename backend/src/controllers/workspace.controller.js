import * as workspaceService from "../services/workspace.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createWorkspaceController = async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user.id, req.body);
    return res.status(201).json(new ApiResponse(201, workspace, "Workspace created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getWorkspacesController = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getWorkspaces(req.user.id);
    return res.status(200).json(new ApiResponse(200, workspaces, "Workspaces retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceByIdController = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, workspace, "Workspace retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateWorkspaceController = async (req, res, next) => {
  try {
    const workspace = await workspaceService.updateWorkspace(req.user.id, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, workspace, "Workspace updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspaceController = async (req, res, next) => {
  try {
    await workspaceService.deleteWorkspace(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Workspace deleted successfully"));
  } catch (error) {
    next(error);
  }
};

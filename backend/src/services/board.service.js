import * as boardRepo from "../repositories/board.repository.js";
import { getWorkspaceById } from "./workspace.service.js";
import AppError from "../utils/AppError.js";
import logger from "../../config/logger.js";

export const createBoard = async (userId, data) => {
  logger.info(`[BoardService] Starting createBoard for user ${userId} in workspace ${data.workspaceId}`);
  
  // Verify the user has access to this workspace
  logger.info(`[BoardService] Verifying user access to workspace ${data.workspaceId}`);
  await getWorkspaceById(userId, data.workspaceId);

  // Determine the next position
  logger.info(`[BoardService] Fetching existing boards to calculate position`);
  const existingBoards = await boardRepo.getBoardsByWorkspaceId(data.workspaceId);
  const maxPosition = existingBoards.length > 0 
    ? Math.max(...existingBoards.map(b => b.position)) 
    : -1;

  const boardData = {
    name: data.name,
    description: data.description,
    position: maxPosition + 1,
    workspaceId: data.workspaceId,
    createdById: userId
  };

  logger.info(`[BoardService] Inserting new board into repository`);
  const board = await boardRepo.createBoard(boardData);
  logger.info(`[BoardService] Board created successfully with ID: ${board.id}`);
  return board;
};

export const getBoards = async (userId, workspaceId) => {
  logger.info(`[BoardService] Retrieving all boards for workspace ${workspaceId} and user ${userId}`);
  await getWorkspaceById(userId, workspaceId);
  return boardRepo.getBoardsByWorkspaceId(workspaceId);
};

export const getBoardById = async (userId, boardId) => {
  logger.info(`[BoardService] Retrieving board ${boardId} for user ${userId}`);
  const board = await boardRepo.getBoardById(boardId);
  if (!board) {
    logger.warn(`[BoardService] Board ${boardId} not found`);
    throw new AppError("Board not found", 404);
  }

  // Ensure user has access to the workspace of the board
  logger.info(`[BoardService] Verifying workspace access for board ${boardId}`);
  await getWorkspaceById(userId, board.workspaceId);
  logger.info(`[BoardService] Board retrieved successfully`);
  return board;
};

export const updateBoard = async (userId, boardId, data) => {
  logger.info(`[BoardService] Updating board ${boardId} for user ${userId}`);
  const board = await getBoardById(userId, boardId);

  logger.info(`[BoardService] Saving board updates to repository`);
  const updatedBoard = await boardRepo.updateBoard(boardId, data);
  logger.info(`[BoardService] Board updated successfully`);
  return updatedBoard;
};

export const deleteBoard = async (userId, boardId) => {
  logger.info(`[BoardService] Deleting board ${boardId} for user ${userId}`);
  await getBoardById(userId, boardId);
  
  logger.info(`[BoardService] Removing board from repository`);
  const result = await boardRepo.deleteBoard(boardId);
  logger.info(`[BoardService] Board deleted successfully`);
  return result;
};

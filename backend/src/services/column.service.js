import * as columnRepo from "../repositories/column.repository.js";
import { getBoardById } from "./board.service.js";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma.js";

const getMemberRole = async (userId, workspaceId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
  return membership?.role ?? null;
};

export const createColumn = async (userId, data) => {
  const board = await getBoardById(userId, data.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER") {
    throw new AppError("Viewers cannot create columns", StatusCodes.FORBIDDEN);
  }

  const maxPosition = board.columns.length > 0 
    ? Math.max(...board.columns.map(c => c.position)) 
    : -1;

  const columnData = {
    name: data.name,
    position: maxPosition + 1,
    boardId: data.boardId
  };

  return columnRepo.createColumn(columnData);
};

export const getColumnById = async (userId, columnId) => {
  const column = await columnRepo.getColumnById(columnId);
  if (!column) {
    throw new AppError("Column not found", StatusCodes.NOT_FOUND);
  }

  await getBoardById(userId, column.boardId);
  return column;
};

export const updateColumn = async (userId, columnId, data) => {
  const column = await getColumnById(userId, columnId);
  const board = await getBoardById(userId, column.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER" || role === "MEMBER") {
    throw new AppError("Only Admins and Owners can update columns", StatusCodes.FORBIDDEN);
  }

  return columnRepo.updateColumn(columnId, data);
};

export const deleteColumn = async (userId, columnId) => {
  const column = await getColumnById(userId, columnId);
  const board = await getBoardById(userId, column.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER" || role === "MEMBER") {
    throw new AppError("Only Admins and Owners can delete columns", StatusCodes.FORBIDDEN);
  }

  return columnRepo.deleteColumn(columnId);
};

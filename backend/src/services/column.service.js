import * as columnRepo from "../repositories/column.repository.js";
import { getBoardById } from "./board.service.js";
import AppError from "../utils/AppError.js";

export const createColumn = async (userId, data) => {
  // Verify the user has access to this board
  const board = await getBoardById(userId, data.boardId);

  // Determine the next position
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
    throw new AppError("Column not found", 404);
  }

  // Ensure user has access to the board of the column
  await getBoardById(userId, column.boardId);
  return column;
};

export const updateColumn = async (userId, columnId, data) => {
  await getColumnById(userId, columnId);
  return columnRepo.updateColumn(columnId, data);
};

export const deleteColumn = async (userId, columnId) => {
  await getColumnById(userId, columnId);
  return columnRepo.deleteColumn(columnId);
};

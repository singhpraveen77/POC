import * as boardService from "../services/board.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createBoardController = async (req, res, next) => {
  try {
    const board = await boardService.createBoard(req.user.id, req.body);
    return res.status(201).json(new ApiResponse(201, board, "Board created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getBoardsController = async (req, res, next) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json(new ApiResponse(400, null, "workspaceId query parameter is required"));
    }
    const boards = await boardService.getBoards(req.user.id, workspaceId);
    return res.status(200).json(new ApiResponse(200, boards, "Boards retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getBoardByIdController = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, board, "Board retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateBoardController = async (req, res, next) => {
  try {
    const board = await boardService.updateBoard(req.user.id, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, board, "Board updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteBoardController = async (req, res, next) => {
  try {
    await boardService.deleteBoard(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Board deleted successfully"));
  } catch (error) {
    next(error);
  }
};

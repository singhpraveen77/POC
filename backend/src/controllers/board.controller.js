import { StatusCodes } from "http-status-codes";
import * as boardService from "../services/board.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createBoardController = async (req, res, next) => {
  try {
    const board = await boardService.createBoard(req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, board, "Board created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getBoardsController = async (req, res, next) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, "workspaceId query parameter is required"));
    }
    const boards = await boardService.getBoards(req.user.id, workspaceId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, boards, "Boards retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getBoardByIdController = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, board, "Board retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateBoardController = async (req, res, next) => {
  try {
    const board = await boardService.updateBoard(req.user.id, req.params.id, req.body);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, board, "Board updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteBoardController = async (req, res, next) => {
  try {
    await boardService.deleteBoard(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Board deleted successfully"));
  } catch (error) {
    next(error);
  }
};

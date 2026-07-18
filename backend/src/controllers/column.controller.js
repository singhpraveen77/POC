import * as columnService from "../services/column.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createColumnController = async (req, res, next) => {
  try {
    const column = await columnService.createColumn(req.user.id, req.body);
    return res.status(201).json(new ApiResponse(201, column, "Column created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getColumnByIdController = async (req, res, next) => {
  try {
    const column = await columnService.getColumnById(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, column, "Column retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateColumnController = async (req, res, next) => {
  try {
    const column = await columnService.updateColumn(req.user.id, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, column, "Column updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteColumnController = async (req, res, next) => {
  try {
    await columnService.deleteColumn(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Column deleted successfully"));
  } catch (error) {
    next(error);
  }
};

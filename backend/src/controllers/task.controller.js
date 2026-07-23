import { StatusCodes } from "http-status-codes";
import * as taskService from "../services/task.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTaskController = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, task, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, task, "Task retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, task, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};

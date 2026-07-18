import * as taskService from "../services/task.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTaskController = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, task, "Task retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};

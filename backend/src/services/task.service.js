import * as taskRepo from "../repositories/task.repository.js";
import { getColumnById } from "./column.service.js";
import AppError from "../utils/AppError.js";
import logger from "../../config/logger.js";

export const createTask = async (userId, data) => {
  logger.info(`[TaskService] Starting createTask for user ${userId}`);
  
  // Verify the user has access to this column via board
  logger.info(`[TaskService] Verifying user access for columnId ${data.columnId}`);
  const column = await getColumnById(userId, data.columnId);

  // Determine the next position
  logger.info(`[TaskService] Calculating task position in column`);
  const maxPosition = column.tasks.length > 0 
    ? Math.max(...column.tasks.map(t => t.position)) 
    : -1;

  const taskData = {
    title: data.title,
    description: data.description,
    status: data.status || "TODO",
    priority: data.priority || "MEDIUM",
    position: maxPosition + 1,
    columnId: data.columnId,
    createdById: userId,
    assigneeId: data.assigneeId
  };

  logger.info(`[TaskService] Inserting new task into repository`);
  const task = await taskRepo.createTask(taskData);
  logger.info(`[TaskService] Task created successfully with ID: ${task.id}`);
  return task;
};

export const getTaskById = async (userId, taskId) => {
  logger.info(`[TaskService] Retrieving task ${taskId} for user ${userId}`);
  const task = await taskRepo.getTaskById(taskId);
  if (!task) {
    logger.warn(`[TaskService] Task ${taskId} not found`);
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  // Ensure user has access to the column of the task
  logger.info(`[TaskService] Verifying user access to column ${task.columnId} of task ${taskId}`);
  await getColumnById(userId, task.columnId);
  logger.info(`[TaskService] Task retrieved successfully`);
  return task;
};

export const updateTask = async (userId, taskId, data) => {
  logger.info(`[TaskService] Updating task ${taskId} for user ${userId}`);
  const task = await getTaskById(userId, taskId);

  if (data.columnId && data.columnId !== task.columnId) {
    // Make sure user has access to the new column too
    logger.info(`[TaskService] Task moving columns from ${task.columnId} to ${data.columnId}. Verifying new column access.`);
    await getColumnById(userId, data.columnId);
  }

  logger.info(`[TaskService] Saving task updates to database`);
  const updatedTask = await taskRepo.updateTask(taskId, data);
  logger.info(`[TaskService] Task updated successfully`);
  return updatedTask;
};

export const deleteTask = async (userId, taskId) => {
  logger.info(`[TaskService] Deleting task ${taskId} for user ${userId}`);
  await getTaskById(userId, taskId);
  
  logger.info(`[TaskService] Removing task from repository`);
  const result = await taskRepo.deleteTask(taskId);
  logger.info(`[TaskService] Task deleted successfully`);
  return result;
};

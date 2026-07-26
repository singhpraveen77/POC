import * as taskRepo from "../repositories/task.repository.js";
import { getColumnById } from "./column.service.js";
import { getBoardById } from "./board.service.js";
import AppError from "../utils/AppError.js";
import logger from "../../config/logger.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma.js";

const getMemberRole = async (userId, workspaceId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
  return membership?.role ?? null;
};

export const createTask = async (userId, data) => {
  logger.info(`[TaskService] Starting createTask for user ${userId}`);
  
  const column = await getColumnById(userId, data.columnId);
  const board = await getBoardById(userId, column.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER") {
    throw new AppError("Viewers cannot create tasks", StatusCodes.FORBIDDEN);
  }

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
    assigneeId: data.assigneeId || null
  };

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

  await getColumnById(userId, task.columnId);
  logger.info(`[TaskService] Task retrieved successfully`);
  return task;
};

export const updateTask = async (userId, taskId, data) => {
  logger.info(`[TaskService] Updating task ${taskId} for user ${userId}`);
  const task = await getTaskById(userId, taskId);
  const column = await getColumnById(userId, task.columnId);
  const board = await getBoardById(userId, column.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER") {
    throw new AppError("Viewers cannot update tasks", StatusCodes.FORBIDDEN);
  }

  if (data.columnId && data.columnId !== task.columnId) {
    await getColumnById(userId, data.columnId);
  }

  const updatedTask = await taskRepo.updateTask(taskId, data);
  logger.info(`[TaskService] Task updated successfully`);
  return updatedTask;
};

export const deleteTask = async (userId, taskId) => {
  logger.info(`[TaskService] Deleting task ${taskId} for user ${userId}`);
  const task = await getTaskById(userId, taskId);
  const column = await getColumnById(userId, task.columnId);
  const board = await getBoardById(userId, column.boardId);

  const role = await getMemberRole(userId, board.workspaceId);
  if (role === "VIEWER" || role === "MEMBER") {
    throw new AppError("Only Admins and Owners can delete tasks", StatusCodes.FORBIDDEN);
  }

  const result = await taskRepo.deleteTask(taskId);
  logger.info(`[TaskService] Task deleted successfully`);
  return result;
};

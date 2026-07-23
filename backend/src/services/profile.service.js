import { StatusCodes } from "http-status-codes";
import { findByEmail, findById, findByUsername, getProfileById, updateUser } from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";

export const getProfile = async (userId) => {
  const user = await getProfileById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      StatusCodes.NOT_FOUND
    );
  }

  const stats = {
    workspaces: user.memberships.length,
    boardsCreated: user.boardsCreated.length,
    tasksCreated: user.tasksCreated.length,
    assignedTasks: user.assignedTasks.length,
    completedTasks: user.assignedTasks.filter(
      (task) => task.status === "DONE"
    ).length,
  };

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    stats,
    recentWorkspaces: user.memberships.map(
      (membership) => membership.workspace
    ),
    recentBoards: user.boardsCreated,
    recentTasks: user.assignedTasks,
  };
};

export const updateProfile = async (userId, payload) => {
  const { name, username, email } = payload;

  const user = await findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      StatusCodes.NOT_FOUND
    );
  }

  const updateData = {};

  if (name && name !== user.name) {
    updateData.name = name;
  }

  if (username && username !== user.username) {
    const existingUser = await findByUsername(username);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        "Username already exists",
        StatusCodes.CONFLICT
      );
    }

    updateData.username = username;
  }

  if (email && email !== user.email) {
    const existingUser = await findByEmail(email);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        "Email already exists",
        StatusCodes.CONFLICT
      );
    }

    updateData.email = email;

    // further i will check to update by using the otp method !!

  }

  const updatedUser =
    Object.keys(updateData).length > 0
      ? await updateUser(userId, updateData)
      : user;

  return {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };
};
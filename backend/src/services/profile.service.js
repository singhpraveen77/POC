import { StatusCodes } from "http-status-codes";
import { findByEmail, findById, findByUsername, getProfileById, updateProfileImage, updateUser } from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.util.js";
import logger from "../../config/logger.js";

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
      profileImage:user.profileImage,
      profileImageId:user.profileImageId,
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

export const uploadProfileImageService = async (userId, file) => {
  logger.info(`Uploading profile image for user: ${userId}`);

  const user = await findById(userId);

  if (!user) {
    logger.warn(`User not found: ${userId}`);
    throw new AppError("User not found.", STATUS_CODES.NOT_FOUND);
  }

  if (!file) {
    logger.warn(`No profile image provided by user: ${userId}`);
    throw new AppError("Profile image is required.", StatusCodes.BAD_REQUEST);
  }

  if (user.profileImageId) {
    await deleteImage(user.profileImageId);
  }
  logger.info(file);
  const image = await uploadImage(
    file.buffer,
    "kanban/profile",
    userId
  );

  const updatedUser = await updateProfileImage(userId, {
    profileImage: image.secure_url,
    profileImageId: image.public_id,
  });

  logger.info(`Profile image uploaded successfully for user: ${userId}`);

  return {
    profileImage: updatedUser.profileImage,
  };
};

export const deleteProfileImageService = async (userId) => {
  logger.info(`Deleting profile image for user: ${userId}`);

  const user = await findById(userId);

  if (!user) {
    logger.warn(`User not found: ${userId}`);
    throw new AppError("User not found.", StatusCodes.NOT_FOUND);
  }

  if (!user.profileImageId) {
    logger.warn(`No profile image found for user: ${userId}`);
    throw new AppError("Profile image not found.", StatusCodes.NOT_FOUND);
  }

  await deleteImage(user.profileImageId);

  await updateProfileImage(userId, {
    profileImage: null,
    profileImageId: null,
  });

  logger.info(`Profile image deleted successfully for user: ${userId}`);

  return null;
};
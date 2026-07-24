import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteProfileImageService, getProfile, updateProfile, uploadProfileImageService } from "../services/profile.service.js";
import logger from "../../config/logger.js";
import AppError from "../utils/AppError.js";

export const getProfileController = async (req, res, next) => {
  try {
    
    const userId=req.user.id;
    const profile = await getProfile(userId);

    return res.status(StatusCodes.OK).json(
      new ApiResponse(
        StatusCodes.OK,

        profile,
        "Profile fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const profile = await updateProfile(req.user.id, req.body);

    return res.status(StatusCodes.OK).json(
      new ApiResponse(
      StatusCodes.OK,
      profile,
      "Profile updated successfully."
    ));
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImageController = async (req, res, next) => {
  try {
    logger.info(
      `Profile image upload request received for user: ${req.user.id}`
    );

    const data = await uploadProfileImageService(
      req.user.id,
      req.file
    );

    return res.status(StatusCodes.OK).json(
      new ApiResponse(
        StatusCodes.OK,
        data,
        "Profile image uploaded successfully."
      )
    );
  } catch (error) {
    logger.error("Failed to upload profile image.", error);
    next(error);
  }
};

export const deleteProfileImageController = async (req, res, next) => {
  try {
    logger.info(
      `Profile image delete request received for user: ${req.user.id}`
    );

    await deleteProfileImageService(req.user.id);

    return res.status(StatusCodes.OK).json(
      new ApiResponse(
        StatusCodes.OK,
        null,
        "Profile image deleted successfully."
      )
    );
  } catch (error) {
    logger.error("Failed to delete profile image.", error);
    next(error);
  }
};
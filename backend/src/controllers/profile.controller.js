import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getProfile, updateProfile } from "../services/profile.service.js";

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
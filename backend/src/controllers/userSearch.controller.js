import { StatusCodes } from "http-status-codes";
import * as userSearchService from "../services/userSearch.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const searchUsersController = async (req, res, next) => {
  try {
    const q = req.query.q ?? "";
    const results = await userSearchService.searchUsers(req.user.id, q);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, results, "Users retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

import { StatusCodes } from "http-status-codes";
import * as memberService from "../services/member.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMembersController = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const members = await memberService.getMembers(workspaceId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, members, "Members retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const changeMemberRoleController = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const { workspaceId, userId } = req.params;
    const { role } = req.body;
    const member = await memberService.changeMemberRole(requesterId, workspaceId, userId, role);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, member, "Member role updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const { workspaceId, userId } = req.params;
    await memberService.removeMember(requesterId, workspaceId, userId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Member removed successfully"));
  } catch (error) {
    next(error);
  }
};

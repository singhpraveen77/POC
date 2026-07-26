import { StatusCodes } from "http-status-codes";
import * as inviteService from "../services/invite.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const sendInviteController = async (req, res, next) => {
  try {
    const invite = await inviteService.sendInvite(req.user.id, req.params.workspaceId, req.body);
    return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, invite, "Invite sent successfully"));
  } catch (error) {
    next(error);
  }
};

export const getIncomingInvitesController = async (req, res, next) => {
  try {
    const invites = await inviteService.getIncomingInvites(req.user.id);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, invites, "Incoming invites retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getOutgoingInvitesController = async (req, res, next) => {
  try {
    const invites = await inviteService.getOutgoingInvites(req.params.workspaceId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, invites, "Outgoing invites retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const acceptInviteController = async (req, res, next) => {
  try {
    const result = await inviteService.acceptInvite(req.user.id, req.params.inviteId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "Invite accepted successfully"));
  } catch (error) {
    next(error);
  }
};

export const rejectInviteController = async (req, res, next) => {
  try {
    const invite = await inviteService.rejectInvite(req.user.id, req.params.inviteId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, invite, "Invite rejected successfully"));
  } catch (error) {
    next(error);
  }
};

export const cancelInviteController = async (req, res, next) => {
  try {
    const invite = await inviteService.cancelInvite(req.user.id, req.params.workspaceId, req.params.inviteId);
    return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, invite, "Invite cancelled successfully"));
  } catch (error) {
    next(error);
  }
};

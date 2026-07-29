import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma.js";
import AppError from "../utils/AppError.js";
const RANK = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};
export const checkPermission = (userRole, requiredRole) => {
  return RANK[userRole] >= RANK[requiredRole];
};
export const requireRole = (minRole) => async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: req.user.id,
        },
      },
    });
    if (!membership) {
      return next(new AppError("Not a member of this workspace", StatusCodes.FORBIDDEN));
    }
    if (!checkPermission(membership.role, minRole)) {
      return next(new AppError("Insufficient permissions", StatusCodes.FORBIDDEN));
    }
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { requireRole } from "../middleware/workspacePermission.middleware.js";
import { sendInviteSchema } from "../validators/invite.validators.js";
import {
  sendInviteController,
  getOutgoingInvitesController,
  getIncomingInvitesController,
  acceptInviteController,
  rejectInviteController,
  cancelInviteController
} from "../controllers/invite.controller.js";

export const workspaceInviteRoutes = Router({ mergeParams: true });

workspaceInviteRoutes.post("/", authenticate, requireRole("ADMIN"), validate(sendInviteSchema), sendInviteController);
workspaceInviteRoutes.get("/outgoing", authenticate, requireRole("ADMIN"), getOutgoingInvitesController);

export const inviteRoutes = Router();

inviteRoutes.get("/incoming", authenticate, getIncomingInvitesController);
inviteRoutes.patch("/:inviteId/accept", authenticate, acceptInviteController);
inviteRoutes.patch("/:inviteId/reject", authenticate, rejectInviteController);
inviteRoutes.patch("/:inviteId/cancel", authenticate, cancelInviteController);

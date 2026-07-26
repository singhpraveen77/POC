import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { requireRole } from "../middleware/workspacePermission.middleware.js";
import { changeRoleSchema } from "../validators/member.validators.js";
import {
  getMembersController,
  changeMemberRoleController,
  removeMemberController
} from "../controllers/member.controller.js";

const memberRoutes = Router();

memberRoutes.get("/:workspaceId/members", authenticate, requireRole("VIEWER"), getMembersController);
memberRoutes.patch("/:workspaceId/members/:userId/role", authenticate, requireRole("ADMIN"), validate(changeRoleSchema), changeMemberRoleController);
memberRoutes.delete("/:workspaceId/members/:userId", authenticate, requireRole("ADMIN"), removeMemberController);

export default memberRoutes;

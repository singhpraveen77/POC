import { Router } from "express";
import {
  createWorkspaceController,
  getWorkspacesController,
  getWorkspaceByIdController,
  updateWorkspaceController,
  deleteWorkspaceController
} from "../controllers/workspace.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../validators/workspace.validators.js";

const workspaceRoutes = Router();

workspaceRoutes.use(authenticate);

workspaceRoutes.post("/", validate(createWorkspaceSchema), createWorkspaceController);
workspaceRoutes.get("/", getWorkspacesController);
workspaceRoutes.get("/:id", getWorkspaceByIdController);
workspaceRoutes.put("/:id", validate(updateWorkspaceSchema), updateWorkspaceController);
workspaceRoutes.delete("/:id", deleteWorkspaceController);

export default workspaceRoutes;

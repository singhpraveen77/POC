import { Router } from "express";
import {
  createTaskController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
} from "../controllers/task.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validators.js";

const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes.post("/", validate(createTaskSchema), createTaskController);
taskRoutes.get("/:id", getTaskByIdController);
taskRoutes.put("/:id", validate(updateTaskSchema), updateTaskController);
taskRoutes.delete("/:id", deleteTaskController);

export default taskRoutes;

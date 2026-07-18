import { Router } from "express";
import {
  createColumnController,
  getColumnByIdController,
  updateColumnController,
  deleteColumnController
} from "../controllers/column.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createColumnSchema, updateColumnSchema } from "../validators/column.validators.js";

const columnRoutes = Router();

columnRoutes.use(authenticate);

columnRoutes.post("/", validate(createColumnSchema), createColumnController);
columnRoutes.get("/:id", getColumnByIdController);
columnRoutes.put("/:id", validate(updateColumnSchema), updateColumnController);
columnRoutes.delete("/:id", deleteColumnController);

export default columnRoutes;

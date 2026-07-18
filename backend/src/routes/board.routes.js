import { Router } from "express";
import {
  createBoardController,
  getBoardsController,
  getBoardByIdController,
  updateBoardController,
  deleteBoardController
} from "../controllers/board.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createBoardSchema, updateBoardSchema } from "../validators/board.validators.js";

const boardRoutes = Router();

boardRoutes.use(authenticate);

boardRoutes.post("/", validate(createBoardSchema), createBoardController);
boardRoutes.get("/", getBoardsController);
boardRoutes.get("/:id", getBoardByIdController);
boardRoutes.put("/:id", validate(updateBoardSchema), updateBoardController);
boardRoutes.delete("/:id", deleteBoardController);

export default boardRoutes;

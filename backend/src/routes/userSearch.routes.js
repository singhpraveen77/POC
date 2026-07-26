import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { searchUsersController } from "../controllers/userSearch.controller.js";

const userSearchRoutes = Router();

userSearchRoutes.use(authenticate);

userSearchRoutes.get("/search", searchUsersController);

export default userSearchRoutes;

import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getProfileController, updateProfileController } from "../controllers/profile.controller.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/profile.validators.js";

const profileRoutes = Router();



profileRoutes.get(
  "/",
  authenticate,
  getProfileController
);

profileRoutes.patch(
  "/",
  authenticate,
  validate(updateProfileSchema),
  updateProfileController
);

export default profileRoutes;



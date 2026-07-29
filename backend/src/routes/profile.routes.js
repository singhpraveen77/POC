import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { deleteProfileImageController, getProfileController, updateProfileController, uploadProfileImageController } from "../controllers/profile.controller.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/profile.validators.js";
import upload from "../middleware/upload.middleware.js";
import multerErrorHandler from "../middleware/multerError.middleware.js";

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

profileRoutes.patch(
  "/image",
  authenticate,
  upload.single("file"),
  multerErrorHandler,
  uploadProfileImageController
);

profileRoutes.delete(
  "/image",
  authenticate,
  deleteProfileImageController
);

export default profileRoutes;
import { Router } from "express";

import {
  registerController,
  verifyOtpController,
  loginController,
  verifyUserController,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  verifyUserSchema
} from "../validators/auth.validators.js";
import { verifyOtp } from "../services/auth.service.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(registerSchema),
  registerController
);

authRoutes.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  verifyOtpController
);

authRoutes.post(
  "/login",
  validate(loginSchema),
  loginController
);

authRoutes.post(
  "/verify-user",
  verifyUserController
)

export default authRoutes;




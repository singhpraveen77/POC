import { Router } from "express";

import {
  registerController,
  verifyOtpController,
  loginController,
  verifyUserController,
  logoutController,
  getMeController,
  bypassController,
  sendVerificationCodeController,
  verifyEmailController
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";

import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  verifyUserSchema,
  sendVerificationCodeSchema,
  verifyEmailSchema
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
  "/send-verification-code",
  validate(sendVerificationCodeSchema),
  sendVerificationCodeController
);

authRoutes.post(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmailController
);
authRoutes.post(
  "/bypass",
  bypassController
);

authRoutes.post(
  "/verify-user",
  validate(verifyUserSchema),
  verifyUserController
)

authRoutes.post(
  "/logout",
  logoutController
);

import { authenticate } from "../middleware/auth.middleware.js";

authRoutes.get(
  "/me",
  authenticate,
  getMeController
);

export default authRoutes;

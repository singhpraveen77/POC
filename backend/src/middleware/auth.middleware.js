import { StatusCodes } from "http-status-codes";
import { verifyRefreshToken } from "../helper/auth.helper.js";
import { findById } from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await findById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", StatusCodes.NOT_FOUND));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED));
  }
};
export const authenticateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(new AppError("Refresh token required", StatusCodes.UNAUTHORIZED));
    }

    const validToken = await verifyRefreshToken(refreshToken);

    req.user = validToken.user;
    req.refreshToken = validToken;

    next();
  } catch (error) {
    next(error);
  }
};


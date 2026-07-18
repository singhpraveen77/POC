import { findById } from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
// import { findById } from "../repositories/user.repository.js";

export const authenticate = async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await findById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
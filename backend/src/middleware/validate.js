import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError.js";

export const validate = (schema) => {
  return (req, res, next) => {

    const result =
      schema.safeParse(req.body);

    if (!result.success) {
      return next(new AppError("Validation failed", StatusCodes.BAD_REQUEST, result.error.flatten()));
}

    req.body = result.data;

    next();
  };
};
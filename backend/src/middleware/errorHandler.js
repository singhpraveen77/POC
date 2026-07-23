import { StatusCodes } from "http-status-codes";
import logger from "../../config/logger.js";
import { Prisma } from "@prisma/client";

 const errorHandler = (err, req, res, next) => {
  
    logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = StatusCodes.BAD_REQUEST;
      message = `Duplicate field value entered.`;
    } else if (err.code === 'P2025') {
      statusCode = StatusCodes.NOT_FOUND;
      message = "Record not found.";
    } else {
      statusCode = StatusCodes.BAD_REQUEST;
      message = `Database error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid data format provided.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;

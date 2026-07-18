import logger from "../../config/logger.js";
import { Prisma } from "@prisma/client";

 const errorHandler = (err, req, res, next) => {
  
    logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });


  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = `Duplicate field value entered.`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = "Record not found.";
    } else {
      statusCode = 400;
      message = `Database error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data format provided.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;

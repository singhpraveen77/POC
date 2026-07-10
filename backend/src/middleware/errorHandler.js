import logger from "../../config/logger.js";

 const errorHandler = (err, req, res, next) => {
  
    logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });


  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
  });
};

export default errorHandler;

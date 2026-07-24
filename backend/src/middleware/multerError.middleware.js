import multer from "multer";
import AppError from "../utils/AppError.js";

const multerErrorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return next(
          new AppError(
            "Image size must not exceed 5 MB.",
            StatusCodes.BAD_REQUEST,
            err
          )
        );

      case "LIMIT_FILE_COUNT":
        return next(
          new AppError(
            "Only one image can be uploaded.",
            StatusCodes.BAD_REQUEST,
            err
          )
        );

      case "LIMIT_UNEXPECTED_FILE":
        return next(
          new AppError(
            "Unexpected file field. Please upload using the 'image' field.",
            StatusCodes.BAD_REQUEST,
            err
          )
        );

      default:
        return next(
          new AppError(
            "File upload failed.",
            StatusCodes.BAD_REQUEST,
            err
          )
        );
    }
  }

  if (err instanceof AppError) {
    return next(err);
  }

  return next(
    new AppError(
      "Something went wrong while uploading the file.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      err
    )
  );
};

export default multerErrorHandler;
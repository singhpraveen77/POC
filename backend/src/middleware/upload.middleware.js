import multer from "multer";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new AppError(
          "Only image files are allowed.",
          StatusCodes.BAD_REQUEST
        ),
        false
      );
    }

    cb(null, true);
  } catch (error) {
    cb(
      new AppError(
        "Failed to validate uploaded file.",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

export default upload;
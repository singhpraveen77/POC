import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import AppError from "./AppError.js";
import { StatusCodes } from "http-status-codes";
import logger from "../../config/logger.js";

export const uploadImage = async (buffer, folder, publicId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload failed", error);
            return reject(
              new AppError(
                "Failed to upload image to Cloudinary",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error
              )
            );
          }

          resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Something went wrong while uploading the image.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteImage = async (publicId) => {
  try {
    if (!publicId) return;

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new AppError(
      "Failed to delete image from Cloudinary.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
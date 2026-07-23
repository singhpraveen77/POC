import { StatusCodes } from "http-status-codes";
import { getDbRefreshToken } from "../repositories/refreshToken.repository.js";
import AppError from "../utils/AppError.js";
import { hashToken } from "../utils/hash.js";

export const verifyRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  const validToken = await getDbRefreshToken(tokenHash);

  if (!validToken) {
    throw new AppError("Refresh token not found", StatusCodes.UNAUTHORIZED);
  }

  if (validToken.revokedAt) {
    throw new AppError("Refresh token has been revoked", StatusCodes.UNAUTHORIZED);
  }

  if (validToken.expiresAt < new Date()) {
    throw new AppError("Refresh token has expired", StatusCodes.UNAUTHORIZED);
  }

  return validToken;
};

// on login access and refresh both are generated 
// access in header payload and refresh in cookies will be saved 
// when the auth middleware finds the access is expired 
// it will send the StatusCodes.UNAUTHORIZED unauthorised and will request for the refresh 
// this will hit the auth/refresh by this the new access token is created and send in the 





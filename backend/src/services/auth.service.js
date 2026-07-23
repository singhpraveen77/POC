import {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  getOtp,
  updateUser,
  getProfileById
} from "../repositories/user.repo.js";

import { hashPassword, hashToken } from "../utils/hash.js";
import { sendMail } from "../utils/sendMail.js";
import logger from "../../config/logger.js";
import { verifyEmailTemplate } from "../../templates/email.verify.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

import { isMatch } from "../utils/hash.js";
import { generateAccessToken } from "../utils/jwt.js";
import { createRefreshToken } from "../repositories/refreshToken.repository.js";
import { generateRefreshString } from "../utils/RefreshString.js";
import { StatusCodes } from "http-status-codes";

export const register = async (data) => {
  const { name, username, email, password } = data;

  logger.info("hit the register service ")
  const existingEmail = await findByEmail(email);

  if (existingEmail) {
    if (!existingEmail.isVerified) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      
      logger.info("[AuthService] Existing unverified user found. Re-generating OTP.");
      
      const subject = "Verify your account - OTP Resend";
      const html = await verifyEmailTemplate(existingEmail.name, otp);
      
      await sendMail(email, subject, html);
      
      await updateUser(existingEmail.id, {
        emailVerificationToken: otp,
        emailVerificationExpire: otpExpiry,
      });

      throw new AppError("Email registered but not verified", StatusCodes.FORBIDDEN);
    }
    throw new AppError("Email already registered", StatusCodes.CONFLICT);
  }
    
    logger.info("unique user verified ")
  const existingUsername = await findByUsername(username);

  if (existingUsername) {
    throw new AppError("Username already taken", StatusCodes.CONFLICT);
  }

  const hashedPassword = await hashPassword(password);

  const otp = Math.floor(1000+Math.random()*9000).toString();;
  
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
  logger.info("otp generated !!")

  const subject="verify user !!"

  const user = await createUser({
    name,
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    emailVerificationToken: otp,
    emailVerificationExpire: otpExpiry
    
  });
  try {
    await sendMail(email,subject,html);
    logger.info("user created in db !! email sent successfully.");
  } catch (mailError) {
    logger.error(`[AuthService] Failed to send registration email via Brevo: ${mailError.message}`);
    logger.warn(`[DEVELOPMENT OTP BYPASS] Email delivery failed. For testing/verification, your OTP is: ${otp}`);
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const verifyOtp = async (data) => {
  const { email, otp } = data;
  logger.info(`[AuthService] Verifying OTP for email: ${email}`);

  const user = await findByEmail(email);

  if (!user) {
    logger.warn(`[AuthService] User with email ${email} not found during OTP verification`);
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isVerified) {
    logger.warn(`[AuthService] User ${email} is already verified`);
    throw new AppError("User already verified", StatusCodes.BAD_REQUEST);
  }

  if (new Date() > user.emailVerificationExpire) {
    logger.warn(`[AuthService] OTP expired for user ${email}`);
    throw new AppError("OTP expired", StatusCodes.GONE);
  }

  if (user.emailVerificationToken !== otp) {
    logger.warn(`[AuthService] Invalid OTP provided for user ${email}`);
    throw new AppError("Invalid OTP", StatusCodes.BAD_REQUEST);
  }

  logger.info(`[AuthService] OTP successfully matched. Updating user status to verified.`);
  const updatedUser = await updateUser(user.id, {
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationExpire: null,
  });
  logger.info(`[AuthService] User ${email} verification complete`);

  return updatedUser;
};

export const login = async (data) => {
  const { email, password } = data;
  logger.info(`[AuthService] Starting login process for email: ${email}`);

  const user = await findByEmail(email);
  
  if (!user) {
    logger.warn(`[AuthService] Login failed: User ${email} not found`);
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  logger.info(`[AuthService] User found. Checking verification status.`);
  if (!user.isVerified) {
    logger.warn(`[AuthService] Login failed: User ${email} is not verified`);
    throw new AppError("Please verify your email first", StatusCodes.FORBIDDEN);
  }

  logger.info(`[AuthService] Verifying password matches`);
  const validPassword = await isMatch(password, user.password);

  if (!validPassword) {
    logger.warn(`[AuthService] Login failed: Incorrect password for user ${email}`);
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  logger.info(`[AuthService] Password verified successfully. Login successful.`);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};




export const generateRefreshToken = async (user) => {
  const refreshToken = generateRefreshString();
  const tokenHash = hashToken(refreshToken);

  await createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return refreshToken;
};


export const bypass = async (data)=>{
    const {password}=data;
    if(!password){

        throw new AppError("password not found in body", StatusCodes.BAD_REQUEST);
    }


    const hashedPassword = await hashPassword(password);

  return {
    hashedPassword
  }

}

export const sendVerificationCode = async (data) => {
  const { email } = data;
  logger.info(`[AuthService] Beginning sendVerificationCode for email: ${email}`);

  const user = await findByEmail(email);
  if (!user) {
    logger.warn(`[AuthService] Send verification code failed: User with email ${email} not found`);
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isVerified) {
    logger.warn(`[AuthService] Send verification code failed: User ${email} is already verified`);
    throw new AppError("User already verified", StatusCodes.BAD_REQUEST);
  }

  // Generate 6-digit secure OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hashPassword(otp);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  logger.info(`[AuthService] Generated 6-digit OTP and hashed it successfully for user: ${email}`);

  const subject = "Verify your account - OTP Code";
  const html = verifyEmailTemplate(user.name, otp);

  try {
    await sendMail(email, subject, html);
    logger.info(`[AuthService] Sent OTP email to: ${email}`);
  } catch (mailError) {
    throw new AppError("email service failed", 500);
    logger.error(`[AuthService] Failed to send verification code email via Brevo: ${mailError.message}`);
    logger.warn(`[DEVELOPMENT OTP BYPASS] Email delivery failed. For testing/verification, your OTP is: ${otp}`);
  }

  await updateUser(user.id, {
    emailVerificationToken: hashedOtp,
    emailVerificationExpire: otpExpiry,
  });
  logger.info(`[AuthService] Updated OTP token and expiry in database for user: ${email}`);

  return { email };
};

export const verifyEmail = async (data) => {
  const { email, otp } = data;
  logger.info(`[AuthService] Beginning verifyEmail process for email: ${email}`);

  const user = await findByEmail(email);
  if (!user) {
    logger.warn(`[AuthService] Verification failed: User with email ${email} not found`);
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isVerified) {
    logger.warn(`[AuthService] Verification failed: User ${email} is already verified`);
    throw new AppError("User already verified", StatusCodes.BAD_REQUEST);
  }

  if (!user.emailVerificationToken || !user.emailVerificationExpire) {
    logger.warn(`[AuthService] Verification failed: No OTP token or expiry found for user ${email}`);
    throw new AppError("Invalid verification request", StatusCodes.BAD_REQUEST);
  }

  if (new Date() > user.emailVerificationExpire) {
    logger.warn(`[AuthService] Verification failed: OTP expired for user ${email}`);
    throw new AppError("OTP expired", StatusCodes.GONE);
  }

  const match = await isMatch(otp, user.emailVerificationToken);
  if (!match) {
    logger.warn(`[AuthService] Verification failed: Invalid OTP provided for user ${email}`);
    throw new AppError("Invalid OTP", StatusCodes.BAD_REQUEST);
  }

  logger.info(`[AuthService] OTP code successfully validated. Marking user ${email} as verified.`);
  const updatedUser = await updateUser(user.id, {
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationExpire: null,
  });

  logger.info(`[AuthService] Email verification successful for user: ${email}`);
  return updatedUser;
};



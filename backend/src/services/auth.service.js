import {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  getOtp,
  updateUser,
} from "../repositories/user.repo.js";

import { hashPassword } from "../utils/hashPass.js";
import { sendMail } from "../utils/sendMail.js";
import logger from "../../config/logger.js";
import { verifyEmailTemplate } from "../../templates/email.verify.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

import { isMatch } from "../utils/hashPass.js";
import { generateAccessToken } from "../utils/jwt.js";

export const register = async (data) => {
  const { name, username, email, password } = data;

  logger.info("hit the register service ")
  const existingEmail = await findByEmail(email);

  if (existingEmail) {
      throw new AppError("Email already registered", 409);
    }
    
    logger.info("unique user verified ")
  const existingUsername = await findByUsername(username);

  if (existingUsername) {
    throw new AppError("Username already taken", 409);
  }

  const hashedPassword = await hashPassword(password);

  const otp = Math.floor(1000+Math.random()*9000).toString();;
  
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
  logger.info("otp generated !!")

  const subject="verify user !!"

  const html=verifyEmailTemplate(user.name,otp);

  await sendMail(email,subject,html);

  const user = await createUser({
      name,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationToken: otp,
      emailVerificationExpire: otpExpiry

    });
    
    logger.info("user created in db !!")

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const  verifyUser = async (data) => {
  const {id,email,username}=data;

  if(!id || !email || !username){
    throw new AppError("missing fields",400);
  }

  let user= findByEmail(email);

  if(!user ){
    throw new AppError("Invalid email ",401)
  }

  const otp = Math.floor(1000+Math.random()*9000).toString();;
  
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
  logger.info("otp generated !!")

  const subject="verify user !!"

  const html=verifyEmailTemplate(user.name,otp);

  await sendMail(email,subject,html);

  user=await updateUser(id,
    {
      "emailVerificationToken": otp,
      "emailVerificationExpire": otpExpiry
    }
  );

  logger.info("otp mail sent !! ")

  return user;
}

export const verifyOtp = async (data) => {
  const { email, otp } = data;

  const user = await findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }

  if (new Date() > user.emailVerificationExpire) {
    throw new AppError("OTP expired", 410);
  }

  if (user.emailVerificationToken !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  const updatedUser = await updateUser(user.id, {
    isVerified: true,
    emailVerificationToken: null,
    emailVerificationExpire: null,
  });

  return updatedUser;
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await findByEmail(email);
  
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const validPassword = await isMatch(password, user.password);

  if (!validPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};


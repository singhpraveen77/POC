import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        user,
        "Registration successful. Please verify your email using the OTP sent to your email."
      )
    );
  } catch (error) {
    next(error);
  }
};

export const verifyUserController = async (req, res, next) => {
  try {
    const user = await authService.verifyUser(req.body);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        "Email sent successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const verifyOtpController = async (req, res, next) => {
  try {
    const user = await authService.verifyOtp(req.body);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        "Email verified successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    const token = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { user },
        "Login successful"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json(new ApiResponse(200, { user }, "User retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
export const bypassController = async (req, res, next) => {
  try {
    
    const {hashedPassword}=await authService.bypass(req.body)

    return res.status(200).json(new ApiResponse(200,  {hashedPassword} , "password retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const sendVerificationCodeController = async (req, res, next) => {
  try {
    const result = await authService.sendVerificationCode(req.body);
    return res.status(200).json(new ApiResponse(200, result, "Verification code sent successfully."));
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.body);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
        },
        "Email verified successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

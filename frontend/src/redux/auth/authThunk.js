import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
// import axios from "../../services/axios";

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      console.log("register", res);
      
      return {
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data);

      return {
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const sendVerificationCode = createAsyncThunk(
  "auth/sendVerificationCode",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/send-verification-code", data);
      return {
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Sending verification code failed"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-email", data);
      return {
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const {user } = res.data.data;
      return {
        user,
        message: res.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-user", data);

      return {
        user: res.data.data,
        message: res.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return {
        user: res.data.data.user,
      };
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
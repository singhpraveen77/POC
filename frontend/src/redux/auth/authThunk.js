import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
// import axios from "../../services/axios";

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);

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
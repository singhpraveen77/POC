import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { axiosImageInstance } from "../../axios/axiosImageInstance";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/profile");

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/profile", data);

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadImage",
  async (data, { rejectWithValue }) => {
    try {
      // Correct way to inspect a FormData object
      for (const [key, value] of data.entries()) {
        console.log("FormData ->", key, value);
      }

      const res = await axiosImageInstance.patch("/profile/image", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { addToast } from "../toast/toastSlice";

export const searchUsers = createAsyncThunk("userSearch/search", async (query, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/users/search?q=${query}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to search users";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState: { results: [], status: "idle", error: null },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = userSearchSlice.actions;

export default userSearchSlice.reducer;

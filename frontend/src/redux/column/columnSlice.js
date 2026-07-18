import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { addToast } from "../toast/toastSlice";

export const createColumn = createAsyncThunk("columns/create", async (columnData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/columns", columnData);
    thunkAPI.dispatch(addToast({ message: "Column created successfully", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create column";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateColumn = createAsyncThunk("columns/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/columns/${id}`, data);
    thunkAPI.dispatch(addToast({ message: "Column updated successfully", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update column";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteColumn = createAsyncThunk("columns/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/columns/${id}`);
    thunkAPI.dispatch(addToast({ message: "Column deleted successfully", type: "success" }));
    return id;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete column";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

const columnSlice = createSlice({
  name: "columns",
  initialState: {},
  reducers: {},
});

export default columnSlice.reducer;

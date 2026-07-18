import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { addToast } from "../toast/toastSlice";

export const createTask = createAsyncThunk("tasks/create", async (taskData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/tasks", taskData);
    thunkAPI.dispatch(addToast({ message: "Task created successfully", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create task";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/tasks/${id}`, data);
    thunkAPI.dispatch(addToast({ message: "Task updated successfully", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update task";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/tasks/${id}`);
    thunkAPI.dispatch(addToast({ message: "Task deleted successfully", type: "success" }));
    return id;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete task";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {},
  reducers: {},
});

export default taskSlice.reducer;

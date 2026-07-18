import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";
import { createBoard, updateBoard, deleteBoard } from "../board/boardSlice";

export const fetchWorkspaces = createAsyncThunk("workspaces/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/workspaces");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch workspaces";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const createWorkspace = createAsyncThunk("workspaces/create", async (workspaceData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/workspaces", workspaceData);
    toast.success("Workspace created successfully");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create workspace";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateWorkspace = createAsyncThunk("workspaces/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/workspaces/${id}`, data);
    toast.success("Workspace updated successfully");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update workspace";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteWorkspace = createAsyncThunk("workspaces/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/workspaces/${id}`);
    toast.success("Workspace deleted successfully");
    return id;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete workspace";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        const index = state.items.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.items = state.items.filter(w => w.id !== action.payload);
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        const ws = state.items.find(w => w.id === action.payload.workspaceId);
        if (ws) {
          if (!ws.boards) ws.boards = [];
          // Avoid duplicate boards
          if (!ws.boards.some(b => b.id === action.payload.id)) {
            ws.boards.push(action.payload);
          }
        }
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.items.forEach(ws => {
          if (ws.boards) {
            const idx = ws.boards.findIndex(b => b.id === action.payload.id);
            if (idx !== -1) {
              ws.boards[idx] = { ...ws.boards[idx], ...action.payload };
            }
          }
        });
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items.forEach(ws => {
          if (ws.boards) {
            ws.boards = ws.boards.filter(b => b.id !== action.payload);
          }
        });
      });
  },
});

export default workspaceSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";
import { createColumn, updateColumn, deleteColumn } from "../column/columnSlice";
import { createTask, updateTask, deleteTask } from "../task/taskSlice";

export const fetchBoards = createAsyncThunk("boards/fetchByWorkspace", async (workspaceId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/boards?workspaceId=${workspaceId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch boards";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchBoardDetails = createAsyncThunk("boards/fetchDetails", async (boardId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/boards/${boardId}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch board details";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const createBoard = createAsyncThunk("boards/create", async (boardData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/boards", boardData);
    toast.success("Board created successfully");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create board";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateBoard = createAsyncThunk("boards/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/boards/${id}`, data);
    toast.success("Board updated successfully");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update board";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteBoard = createAsyncThunk("boards/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/boards/${id}`);
    toast.success("Board deleted successfully");
    return id;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete board";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const boardSlice = createSlice({
  name: "boards",
  initialState: {
    items: [],
    currentBoard: null,
    status: "idle",
    error: null,
  },
  reducers: {
    moveTaskOptimistically: (state, action) => {
      const { taskId, fromColumnId, toColumnId } = action.payload;
      if (state.currentBoard && state.currentBoard.columns) {
        state.lastColumnsBackup = JSON.parse(JSON.stringify(state.currentBoard.columns));
        
        let foundTask = null;
        state.currentBoard.columns = state.currentBoard.columns.map(col => {
          if (col.id === fromColumnId) {
            foundTask = col.tasks.find(t => t.id === taskId);
            return {
              ...col,
              tasks: col.tasks.filter(t => t.id !== taskId)
            };
          }
          return col;
        });

        if (foundTask) {
          foundTask.columnId = toColumnId;
          state.currentBoard.columns = state.currentBoard.columns.map(col => {
            if (col.id === toColumnId) {
              const updatedTasks = [...(col.tasks || []), foundTask];
              return {
                ...col,
                tasks: updatedTasks
              };
            }
            return col;
          });
        }
      }
    },
    rollbackMoveTask: (state) => {
      if (state.currentBoard && state.lastColumnsBackup) {
        state.currentBoard.columns = state.lastColumnsBackup;
        state.lastColumnsBackup = null;
      }
    },
    clearMoveBackup: (state) => {
      state.lastColumnsBackup = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchBoardDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoardDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentBoard && state.currentBoard.id === action.payload.id) {
          state.currentBoard = { ...state.currentBoard, ...action.payload };
        }
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b.id !== action.payload);
        if (state.currentBoard && state.currentBoard.id === action.payload) {
          state.currentBoard = null;
        }
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.id === action.payload.boardId) {
          if (!state.currentBoard.columns) {
            state.currentBoard.columns = [];
          }
          const newCol = { ...action.payload, tasks: action.payload.tasks || [] };
          state.currentBoard.columns.push(newCol);
        }
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.columns) {
          const index = state.currentBoard.columns.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            const existingTasks = state.currentBoard.columns[index].tasks || [];
            state.currentBoard.columns[index] = { 
              ...state.currentBoard.columns[index], 
              ...action.payload,
              tasks: action.payload.tasks || existingTasks
            };
          }
        }
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.columns) {
          state.currentBoard.columns = state.currentBoard.columns.filter(c => c.id !== action.payload);
        }
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.columns) {
          const col = state.currentBoard.columns.find(c => c.id === action.payload.columnId);
          if (col) {
            if (!col.tasks) col.tasks = [];
            col.tasks.push(action.payload);
            col.tasks.sort((a, b) => a.position - b.position);
          }
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.columns) {
          state.currentBoard.columns.forEach(c => {
            if (c.tasks) {
              c.tasks = c.tasks.filter(t => t.id !== action.payload.id);
            }
          });
          const col = state.currentBoard.columns.find(c => c.id === action.payload.columnId);
          if (col) {
            if (!col.tasks) col.tasks = [];
            col.tasks.push(action.payload);
            col.tasks.sort((a, b) => a.position - b.position);
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (state.currentBoard && state.currentBoard.columns) {
          state.currentBoard.columns.forEach(c => {
            if (c.tasks) {
              c.tasks = c.tasks.filter(t => t.id !== action.payload);
            }
          });
        }
      });
  },
});

export const { moveTaskOptimistically, rollbackMoveTask, clearMoveBackup } = boardSlice.actions;

export default boardSlice.reducer;

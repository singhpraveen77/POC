import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";
import { createColumn, updateColumn, deleteColumn } from "../column/columnSlice";
import { createTask, updateTask, deleteTask } from "../task/taskSlice";

// DnD operation queue to prevent race conditions
const dndOperations = new Map();

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
      const { taskId, fromColumnId, toColumnId, operationId: providedOperationId } = action.payload;
      
      if (state.currentBoard && state.currentBoard.columns) {
        // Create a unique ID for this operation to track it in the queue
        const operationId = providedOperationId || `${taskId}-${Date.now()}`;
        const operationState = JSON.parse(JSON.stringify(state.currentBoard.columns));
        
        // Store operation metadata for tracking
        dndOperations.set(operationId, {
          taskId,
          operationState,
          timestamp: Date.now()
        });
        
        // Keep only last 5 operations to prevent memory leaks
        if (dndOperations.size > 5) {
          const oldestId = dndOperations.keys().next().value;
          dndOperations.delete(oldestId);
        }
        
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
              const updatedTasks = [...(col.tasks || [])];
              updatedTasks.push(foundTask);
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
    rollbackMoveTask: (state, action) => {
      const { operationId } = action.payload;
      if (operationId && dndOperations.has(operationId)) {
        const operation = dndOperations.get(operationId);
        if (state.currentBoard && operation.operationState) {
          state.currentBoard.columns = operation.operationState;
        }
        dndOperations.delete(operationId);
      } else if (state.currentBoard && state.lastColumnsBackup) {
        state.currentBoard.columns = state.lastColumnsBackup;
        state.lastColumnsBackup = null;
      }
    },
    clearMoveBackup: (state) => {
      state.lastColumnsBackup = null;
    },
    clearDndOperation: (state, action) => {
      const { operationId } = action.payload;
      dndOperations.delete(operationId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBoardDetails.pending, (state) => {
        state.status = "loading";
        state.currentBoard = null;
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
        // DnD moves are handled optimistically — skip column re-placement on success
        // so that stale API responses don't overwrite the already-applied UI state.
        // Only update non-column fields (title, description, etc.) for DnD calls.
        const isDnd = action.meta?.arg?.data?.isDnd === true;

        if (state.currentBoard && state.currentBoard.columns) {
          if (isDnd) {
            // Just update task fields in-place without touching column placement
            state.currentBoard.columns.forEach(col => {
              if (col.tasks) {
                const idx = col.tasks.findIndex(t => t.id === action.payload.id);
                if (idx !== -1) {
                  // Preserve columnId from current state, not from API response
                  col.tasks[idx] = {
                    ...action.payload,
                    columnId: col.tasks[idx].columnId,
                  };
                }
              }
            });
            state.lastColumnsBackup = null;
          } else {
            // Non-DnD update (modal edit): apply full server response including column
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
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        // Roll back optimistic DnD move on failure
        const isDnd = action.meta?.arg?.data?.isDnd === true;
        
        if (isDnd && state.currentBoard) {
          // Try to get the operation ID from the meta
          const operationId = action.meta?.arg?.data?.operationId;
          
          if (operationId && dndOperations.has(operationId)) {
            // Use the stored operation state for rollback
            const operation = dndOperations.get(operationId);
            if (operation && operation.operationState) {
              state.currentBoard.columns = operation.operationState;
            }
            dndOperations.delete(operationId);
          } else if (state.lastColumnsBackup) {
            // Fallback to lastColumnsBackup if operationId not available
            state.currentBoard.columns = state.lastColumnsBackup;
            state.lastColumnsBackup = null;
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

export const { moveTaskOptimistically, rollbackMoveTask, clearMoveBackup, clearDndOperation } = boardSlice.actions;

export default boardSlice.reducer;
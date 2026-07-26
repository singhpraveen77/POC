import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";

export const fetchMembers = createAsyncThunk("workspaceMembers/fetch", async (workspaceId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/members`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch members";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const changeMemberRole = createAsyncThunk("workspaceMembers/changeRole", async ({ workspaceId, userId, role }, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/workspaces/${workspaceId}/members/${userId}/role`, { role });
    toast.success("Member role updated successfully");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to change member role";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeMember = createAsyncThunk("workspaceMembers/remove", async ({ workspaceId, userId }, thunkAPI) => {
  try {
    await axiosInstance.delete(`/workspaces/${workspaceId}/members/${userId}`);
    toast.success("Member removed successfully");
    return userId;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to remove member";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const workspaceMemberSlice = createSlice({
  name: "workspaceMembers",
  initialState: {
    members: [],
    status: "idle",
    error: null,
  },
  reducers: {
    upsertMember: (state, action) => {
      const index = state.members.findIndex((m) => m.userId === action.payload.userId);
      if (index !== -1) {
        state.members[index] = action.payload;
      } else {
        state.members.push(action.payload);
      }
    },
    removeMemberById: (state, action) => {
      state.members = state.members.filter((m) => m.userId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(changeMemberRole.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m.userId === action.payload.userId);
        if (index !== -1) {
          state.members[index].role = action.payload.role;
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.userId !== action.payload);
      });
  },
});

export const { upsertMember, removeMemberById } = workspaceMemberSlice.actions;

export default workspaceMemberSlice.reducer;

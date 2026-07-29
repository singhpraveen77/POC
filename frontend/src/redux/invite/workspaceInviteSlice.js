import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { addToast } from "../toast/toastSlice";
export const fetchIncomingInvites = createAsyncThunk("workspaceInvites/fetchIncoming", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/invites/incoming");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch incoming invites";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
export const fetchOutgoingInvites = createAsyncThunk("workspaceInvites/fetchOutgoing", async (workspaceId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/invites/outgoing`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch outgoing invites";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
export const sendInvite = createAsyncThunk("workspaceInvites/send", async ({ workspaceId, invitedUserId, role }, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/workspaces/${workspaceId}/invites`, { invitedUserId, role });
    thunkAPI.dispatch(addToast({ message: "Invitation sent successfully", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send invite";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
export const acceptInvite = createAsyncThunk("workspaceInvites/accept", async (inviteId, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/invites/${inviteId}/accept`);
    thunkAPI.dispatch(addToast({ message: "Invitation accepted", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to accept invite";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
export const rejectInvite = createAsyncThunk("workspaceInvites/reject", async (inviteId, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/invites/${inviteId}/reject`);
    thunkAPI.dispatch(addToast({ message: "Invitation rejected", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to reject invite";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
export const cancelInvite = createAsyncThunk("workspaceInvites/cancel", async ({ workspaceId, inviteId }, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/invites/${inviteId}/cancel`);
    thunkAPI.dispatch(addToast({ message: "Invitation cancelled", type: "success" }));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to cancel invite";
    thunkAPI.dispatch(addToast({ message, type: "error" }));
    return thunkAPI.rejectWithValue(message);
  }
});
const workspaceInviteSlice = createSlice({
  name: "workspaceInvites",
  initialState: {
    incoming: [],
    outgoing: [],
    status: "idle",
    error: null,
  },
  reducers: {
    appendIncomingInvite: (state, action) => {
      state.incoming.push(action.payload);
    },
    removeIncomingInvite: (state, action) => {
      state.incoming = state.incoming.filter((invite) => invite.id !== action.payload);
    },
    removeOutgoingInvite: (state, action) => {
      state.outgoing = state.outgoing.filter((invite) => invite.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomingInvites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIncomingInvites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.incoming = action.payload;
      })
      .addCase(fetchIncomingInvites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOutgoingInvites.fulfilled, (state, action) => {
        state.outgoing = action.payload;
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.outgoing.push(action.payload);
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.incoming = state.incoming.filter((invite) => invite.id !== action.payload.invite.id);
      })
      .addCase(rejectInvite.fulfilled, (state, action) => {
        state.incoming = state.incoming.filter((invite) => invite.id !== action.payload.id);
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        state.outgoing = state.outgoing.filter((invite) => invite.id !== action.payload.id);
      });
  },
});
export const { appendIncomingInvite, removeIncomingInvite, removeOutgoingInvite } = workspaceInviteSlice.actions;
export default workspaceInviteSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { getProfile, updateProfile  } from "./profileThunk";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
    },

    clearProfileError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })

        .addCase(updateProfile.fulfilled, (state, action) => {
          state.loading = false;

          if (state.profile) {
            state.profile.user = action.payload.user;
          }
        })

        .addCase(updateProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
          }
    });

export const { clearProfile, clearProfileError } =
  profileSlice.actions;

export default profileSlice.reducer;
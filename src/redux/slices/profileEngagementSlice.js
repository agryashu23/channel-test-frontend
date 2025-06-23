import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const setProfileEngagement = createAsyncThunk(
  "profileEngagement/engagement",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/set/profile/engagement`,
        { user_id }
      );
      if (response.success) {
        return user_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const setProfileSubscription = createAsyncThunk(
  "profileEngagement/subscription",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(`/tackle/subscription`, {
        receiverId: user_id,
      });
      if (response.success) {
        return user_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const profileEngagementSlice = createSlice({
  name: "profileEngagement",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(setProfileEngagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setProfileEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setProfileEngagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileEngagementSlice.reducer;

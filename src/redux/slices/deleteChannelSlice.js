// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";

export const deleteChannel = createAsyncThunk(
  "channel/deleteChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/channel", {
        id: channelId,
      });
      if (response.success) {
        return response.channel;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const channelDeletionSlice = createSlice({
  name: "channelDeletion",
  initialState: {
    channelId: null,
    channelName: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setChannelIdToDelete: (state, action) => {
      state.channelId = action.payload;
    },
    setChannelNameToDelete: (state, action) => {
      state.channelName = action.payload;
    },
    clearChannelIdToDelete: (state) => {
      state.channelId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteChannel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.channelId = null;
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setChannelIdToDelete,
  clearChannelIdToDelete,
  setChannelNameToDelete,
} = channelDeletionSlice.actions;

export default channelDeletionSlice.reducer;

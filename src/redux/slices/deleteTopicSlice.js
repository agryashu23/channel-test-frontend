// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";

export const deleteTopic = createAsyncThunk(
  "Topic/deleteTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/topic", {
        id: topicId,
      });
      if (response.success) {
        return response.topic;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const topicDeletionSlice = createSlice({
  name: "topicDeletion",
  initialState: {
    topicId: null,
    channelId: null,
    topicName: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setTopicIdToDelete: (state, action) => {
      state.topicId = action.payload;
    },
    setTopicNameToDelete: (state, action) => {
      state.topicName = action.payload;
    },
    setTopicChannelToDelete: (state, action) => {
      state.channelId = action.payload;
    },
    clearTopicIdToDelete: (state) => {
      state.topicId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTopic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topicId = null;
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setTopicIdToDelete,
  clearTopicIdToDelete,
  setTopicNameToDelete,
  setTopicChannelToDelete,
} = topicDeletionSlice.actions;

export default topicDeletionSlice.reducer;

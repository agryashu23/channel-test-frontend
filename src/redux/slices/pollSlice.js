import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticatedWithFile,
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";

export const createChatPoll = createAsyncThunk(
  "poll/createPoll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/chat/poll",
        data
      );
      if (response.success) {
        return response.poll;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const privatePollResponse = createAsyncThunk(
  "poll/privatePollResponse",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/private/poll/response",
        data
      );
      if (response.success) {
        return response.poll;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const publicPollResponse = createAsyncThunk(
  "poll/publicPollResponse",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/create/public/poll/response",
        data
      );
      if (response.success) {
        return response.poll;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  question: "",
  answers: [],
  status: "idle",
  type: "private",
  error: null,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPollItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPollField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearChatPoll: (state, action) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatPoll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createChatPoll.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(createChatPoll.rejected, (state, action) => {
        state.status = "idle";
      });
    //   .addCase(editChatPoll.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(editChatPoll.fulfilled, (state, action) => {
    //     state.status = "idle";
    //   })
    //   .addCase(editChatPoll.rejected, (state, action) => {
    //     state.status = "idle";
    //   });
  },
});

export const { setPollField, clearChatPoll, setPollItems } = pollSlice.actions;

export default pollSlice.reducer;

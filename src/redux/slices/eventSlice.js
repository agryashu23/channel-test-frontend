import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticatedWithFile,
  postRequestAuthenticated,
} from "./../../services/rest";

export const createChatEvent = createAsyncThunk(
  "event/createChatEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/chat/event",
        data
      );
      if (response.success) {
        return response.chat;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editChatEvent = createAsyncThunk(
  "event/editChatEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/edit/chat/event",
        data
      );
      if (response.success) {
        return response.chat;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteChatEvent = createAsyncThunk(
  "event/deleteChatEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/chat/event", {
        eventId,
      });
      if (response.success) {
        return response.event;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const joinEvent = createAsyncThunk(
  "event/joinEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/join/event", {
        eventId,
      });
      if (response.success) {
        return response.event;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  name: "",
  topic: "",
  description: "",
  startDate: "",
  type: "offline",
  meet_url: "",
  endDate: "",
  startTime: "",
  endTime: "",
  locationText: "",
  timezone: "Asia/Kolkata",
  location: "",
  joining: "public",
  cover_image: "",
  cover_image_source: "",
  status: "idle",
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setEventField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearEvent: (state, action) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createChatEvent.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(createChatEvent.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(editChatEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editChatEvent.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(editChatEvent.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { setEventField, clearEvent, setEventItems } = eventSlice.actions;

export default eventSlice.reducer;

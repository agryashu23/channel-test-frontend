// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { createChatEvent, deleteChatEvent, editChatEvent } from "./eventSlice";
import { createChatPoll } from "./pollSlice";
import { verifyPayment } from "./paymentSlice";

export const fetchTopicEvents = createAsyncThunk(
  "channelChat/fetchTopicEvents",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/topic/events", {
        topicId: topicId,
      });
      if (response.success) {
        return response.events;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopicEventMembers = createAsyncThunk(
  "channelChat/fetchTopicEventMembers",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/topic/event/members",
        {
          topicId: topicId,
        }
      );
      if (response.success) {
        return response.memberships;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllEventMembers = createAsyncThunk(
  "event/fetchAllEventMembers",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/event/members", {
        eventId: eventId,
      });
      console.log(response);
      if (response.success) {
        return response.memberships;
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
      console.log(response);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventData = createAsyncThunk(
  "event/fetchEventData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/event/data",
        data
      );
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eventItemsSlice = createSlice({
  name: "eventItemsSlice ",
  initialState: {
    event: {},
    membership: {},
    events: [],
    joinStatus: "idle",
    topicEventMembers: [],
    loading: false,
    error: null,
    eventMembers: [],
    joinEventError: null,
  },
  reducers: {
    setChatField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addBrandMessage: (state, action) => {
      state.brandChats.push(action.payload);
    },
    setEventField: (state, action) => {
      state.event = action.payload;
    },
    addMessage: (state, action) => {
      state.chats.push(action.payload);
    },
    deleteMessage: (state, action) => {
      let index = state.chats.findIndex((item) => item._id === action.payload);
      if (index !== -1) {
        state.chats.splice(index, 1);
      }
    },
    addMediaItem: (state, action) => {
      state.media.push(action.payload);
    },
    removeMediaItem: (state, action) => {
      state.media = state.media.filter((_, index) => index !== action.payload);
    },
    clearMedia: (state, action) => {
      state.media = [];
    },
    clearChatIdToDelete: (state, action) => {
      state.chatReplyId = "";
    },
    clearChat: (state) => {
      state.events = [];
      state.topicEventMembers = [];
      state.eventMembers = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicEvents.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(fetchTopicEvents.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchTopicEvents.rejected, (state, action) => {
        state.eventLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchEventData.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(fetchEventData.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.event = action.payload.event;
        state.membership = action.payload.membership;
      })
      .addCase(fetchEventData.rejected, (state, action) => {
        state.eventLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchTopicEventMembers.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(fetchTopicEventMembers.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.topicEventMembers = action.payload;
      })
      .addCase(fetchTopicEventMembers.rejected, (state, action) => {
        state.eventLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchAllEventMembers.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(fetchAllEventMembers.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.eventMembers = action.payload;
      })
      .addCase(fetchAllEventMembers.rejected, (state, action) => {
        state.eventLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(createChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) {
          const chat = response.chat;
          state.events.push(chat.event);
        }
      })
      .addCase(createChatPoll.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success) {
          const chat = response.chat;
          state.events.push(chat.poll);
        }
      })
      .addCase(deleteChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const event = action.payload;
        let index = state.events.findIndex((item) => item._id === event._id);
        if (index !== -1) {
          state.events.splice(index, 1);
        }
        if (state.event._id === event._id) {
          state.event = {};
          state.membership = {};
        }
      })
      .addCase(editChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) {
          const chat = response.chat;
          let index = state.events.findIndex(
            (item) => item._id === chat.event._id
          );
          if (index !== -1) {
            state.events[index] = chat.event;
          }
          if (state.event._id === chat.event._id) {
            state.event = chat.event;
          }
        }
      })
      .addCase(joinEvent.pending, (state) => {
        state.joinStatus = "loading";
        state.joinEventError = null;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.joinStatus = "idle";
        state.joinEventError = action.payload;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.joinStatus = "idle";
        state.joinEventError = null;
        const response = action.payload;
        console.log(response);
        if (response.success && response.membership) {
          const index = state.topicEventMembers.findIndex(
            (item) => item._id === response.membership._id
          );
          if (index === -1) {
            state.topicEventMembers.push(response.membership);
          } else {
            state.topicEventMembers[index] = response.membership;
          }
        }
        if (state.event?._id === response.membership?.event) {
          state.membership = response.membership;
        }
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.joinStatus = "idle";
        const response = action.payload;
        if (
          response.type === "event" &&
          response.success &&
          response.membership
        ) {
          const index = state.topicEventMembers.findIndex(
            (item) => item._id === response.membership._id
          );
          if (index === -1) {
            state.topicEventMembers.push(response.membership);
          } else {
            state.topicEventMembers[index] = response.membership;
          }
        }
        if (
          response.type === "event" &&
          response.success &&
          state.event?._id === response.membership?.event
        ) {
          state.membership = response.membership;
        }
      });
  },
});

export const {
  setChatField,
  addMediaItem,
  removeMediaItem,
  clearChat,
  clearChatIdToDelete,
  addMessage,
  clearMedia,
  deleteMessage,
  setEventField,
  addBrandMessage,
} = eventItemsSlice.actions;

export default eventItemsSlice.reducer;

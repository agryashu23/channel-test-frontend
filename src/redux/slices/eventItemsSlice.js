// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import {
  createChatEvent,
  deleteChatEvent,
  editChatEvent,
} from "./eventSlice";


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
      const response = await postRequestAuthenticated("/fetch/topic/event/members", {
        topicId: topicId,
      });
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
  "channelChat/fetchAllEventMembers",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/event/members", {
        eventId: eventId,
      });
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


export const eventItemsSlice = createSlice({
  name: "eventItemsSlice ",
  initialState: {
    events:[],
    joinStatus:"idle",
    topicEventMembers:[],
    loading:false,
    error:null,
    eventMembers:[]
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
        const chat = action.payload;
        state.events.push(chat.event);
      })
      .addCase(deleteChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const event = action.payload;
        let index = state.chats.findIndex((chat) => chat._id === event.chat);
        if (index !== -1) {
          state.chats.splice(index, 1);
        }
      })
      .addCase(editChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const chat = action.payload;
        let index = state.chats.findIndex((item) => item._id === chat._id);
        if (index !== -1) {
          state.chats[index] = chat;
        }
      })
      .addCase(joinEvent.pending, (state) => {
        state.joinStatus = "loading";
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.joinStatus = "idle";
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.joinStatus = "idle";
        const response = action.payload;
        if(response.membership){
          const index = state.topicEventMembers.findIndex((item) => item._id === response.membership._id);
          if(index===-1){
            state.topicEventMembers.push(response.membership);
          }
          else{
            state.topicEventMembers[index] = response.membership;
          }
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

// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import {
  editChatEvent,
} from "./eventSlice";

export const fetchInboxMessages = createAsyncThunk(
  "DM/fetchInboxMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/inbox/messages");
      if (response.success) {
        return response.messages;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchDMChats = createAsyncThunk(
  "DM/fetchDMChats",
  async (receiver, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/dm/chats", {
        receiverUsername: receiver,
      });
      if (response.success) {
        return response.chats;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDMChat = createAsyncThunk(
  "DM/createDM",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/dm/chat",
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

export const deleteDMChat = createAsyncThunk(
  "DM/deleteDMChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/dm/chat", {
        id: id,
      });
      if (response.success) {
        return response.id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleDMReaction = createAsyncThunk(
  "DM/make-dm-reaction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/toggle/dm/reaction",
        data
      );
      if (response.success) {
        const data = {
          chatId: response.chatId,
          reaction: response.reaction,
        };
        return data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const markDMLastSeen = createAsyncThunk(
  "DM/mark-dm-last-seen",
  async (receiver, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/mark/dm/last/seen", {
        receiver: receiver,
      });
      if (response.success) {
        const data = {
          chatId: response.chatId,
          reaction: response.reaction,
        };
        return data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dmSlice = createSlice({
  name: "dmSlice ",
  initialState: {
    messages: [],
    chatError: null,
    isScroll: true,
    user: null,
    media: [],
    replyTo: null,
    replyUsername: "",
    reactions: [],
    mentions: [],
    chats: [],
    content: "",
    chatReplyId: "",
    loading: false,
  },
  reducers: {
    setDMChatField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addDMMessage: (state, action) => {
      state.chats.push(action.payload);
    },
    deleteDMMessage: (state, action) => {
      let index = state.chats.findIndex((item) => item._id === action.payload);
      if (index !== -1) {
        state.chats.splice(index, 1);
      }
    },
    addDMMediaItem: (state, action) => {
      state.media.push(action.payload);
    },
    removeDMMediaItem: (state, action) => {
      state.media = state.media.filter((_, index) => index !== action.payload);
    },
    clearDMMedia: (state, action) => {
      state.media = [];
    },
    clearDMChatIdToDelete: (state, action) => {
      state.chatReplyId = "";
    },
    clearDMChat: (state) => {
      state.user = null;
      state.media = [];
      state.replyTo = null;
      state.poll = {};
      state.event = {};
      state.reactions = [];
      state.mentions = [];
      state.content = "";
      state.replyUsername = "";
      state.chatReplyId = "";
    },
    clearDMChats: (state) => {
      state.chats = [];
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDMChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDMChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchDMChats.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchInboxMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInboxMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchInboxMessages.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.payload || action.error.message;
      })

      .addCase(createDMChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(createDMChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        state.chats.push(action.payload);
      })
      .addCase(createDMChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })

      .addCase(toggleDMReaction.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.chats.findIndex((item) => item._id === data.chatId);
        if (index !== -1) {
          state.chats[index].reactions = data.reaction;
        }
      })
      .addCase(deleteDMChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(deleteDMChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const id = action.payload;
        const index = state.chats.findIndex((item) => item._id === id);
        if (index !== -1) {
          state.chats.splice(index, 1);
        }
      })
      .addCase(deleteDMChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      });
  },
});

export const {
  setDMChatField,
  addDMMediaItem,
  removeDMMediaItem,
  clearDMChat,
  clearDMChatIdToDelete,
  addDMMessage,
  clearDMMedia,
  clearDMChats,
  deleteDMMessage
} = dmSlice.actions;

export default dmSlice.reducer;

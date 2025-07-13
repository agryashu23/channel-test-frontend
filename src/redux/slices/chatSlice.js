// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { createChatEvent, deleteChatEvent, editChatEvent } from "./eventSlice";
import { createChatPoll, } from "./pollSlice";

export const fetchTopicChats = createAsyncThunk(
  "channelChat/fetchChats",
  async ({ topicId, limit = 15, skip = 0 }, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/topic/chats", {
        topicId,
        limit,
        skip,
      });
      if (response.success) {
        return {
          chats: response.chats,
          hasMore: response.hasMore,
          skip,
        };
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBrandChats = createAsyncThunk(
  "channelChat/fetchBrandChats",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/brand/chats", {
        user_id: user_id,
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
export const fetchResourceChats = createAsyncThunk(
  "channelChat/fetchResourceChats",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/resource/chats", {
        topicId: topicId,
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

export const createTopicChat = createAsyncThunk(
  "channelChat/createChat",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel/chat",
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
export const createBrandChat = createAsyncThunk(
  "channelChat/createbrandChat",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/brand/chat",
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
export const deleteTopicChat = createAsyncThunk(
  "channelChat/deleteChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/topic/chat", {
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

export const createChannelChatReply = createAsyncThunk(
  "channelChat/createChatReply",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel/chat/reply",
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
export const pushToResource = createAsyncThunk(
  "channelChat/pushtoresource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/push/to/resource",
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
export const removeFromResource = createAsyncThunk(
  "channelChat/removefromresource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/from/resource",
        data
      );
      const resourceData = {
        chatId: response.chatId,
        mediaId: response.mediaId,
      };
      if (response.success) {
        return resourceData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const toggleReaction = createAsyncThunk(
  "channelChat/make-reaction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/toggle/reaction", data);
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
export const markAsRead = createAsyncThunk(
  "channelChat/mark-as-read",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/mark/as/read", {
        topicId,
      });
      if (response.success) {
        const data = {
          topicId: topicId,
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

export const fetchPinnedChats = createAsyncThunk(
  "channelChat/fetchPinnedChats",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/pinned/chats", {
        topicId,
      });
      console.log(response);
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

export const pinChat = createAsyncThunk(
  "channelChat/pin-chat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/pin/chat", {
        chatId,
      });
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

export const unpinChat = createAsyncThunk(
  "channelChat/unpin-chat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/unpin/chat", {
        chatId,
      });
      console.log(response);
      if (response.success) {
        return response.chatId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chatSlice ",
  initialState: {
    chats: [],
    resourceChats: [],
    brandChats: [],
    pinnedChats: [],
    pinnedLoading: false,
    chatStatus: "idle",
    chatError: null,
    isScroll: true,
    topic: null,
    channel: null,
    user: null,
    media: [],
    replyTo: null,
    replyUsername: "",
    poll: {},
    event: {},
    reactions: [],
    mentions: [],
    content: "",
    chatReplyId: "",
    topicReplyId: "",
    loading: false,
    loadingMore: false,
    brandLoading: false,
    resourceLoading: false,
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
    reactionMessage: (state, action) => {
      const chat = action.payload;
      const index = state.chats.findIndex((item) => item._id === chat._id);
      if (index !== -1) {
        state.chats[index].reactions = chat.reactions;
      }
    },
    deleteMessage: (state, action) => {
      let index = state.chats.findIndex((item) => item._id === action.payload);
      console.log(index);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicChats.pending, (state, action) => {
        const { skip } = action.meta.arg;
        if (skip === 0) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(fetchTopicChats.fulfilled, (state, action) => {
        const { chats, skip } = action.payload;
        const reversedChats = [...chats].reverse();

        if (skip === 0) {
          state.chats = reversedChats;
          state.loading = false;
        } else {
          const existingMap = new Map(
            state.chats.map((chat) => [chat._id, chat])
          );
          for (const chat of reversedChats) {
            if (!existingMap.has(chat._id)) {
              state.chats.unshift(chat);
            }
          }
          state.loadingMore = false;
        }
      })
      .addCase(fetchTopicChats.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchBrandChats.pending, (state) => {
        state.brandLoading = true;
      })
      .addCase(fetchBrandChats.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brandChats = action.payload;
      })
      .addCase(fetchBrandChats.rejected, (state, action) => {
        state.brandLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchResourceChats.pending, (state) => {
        state.resourceLoading = true;
      })
      .addCase(fetchResourceChats.fulfilled, (state, action) => {
        state.resourceLoading = false;
        state.resourceChats = action.payload;
      })
      .addCase(fetchResourceChats.rejected, (state, action) => {
        state.resourceLoading = false;
        state.chatError = action.payload || action.error.message;
      })

      .addCase(pushToResource.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(pushToResource.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        let index = state.resourceChats.findIndex(
          (item) => item._id === response.chat._id
        );
        if (index !== -1) {
          let mediaIndex = state.resourceChats[index].media.findIndex(
            (item) => item._id === response.mediaId
          );
          if (mediaIndex !== -1) {
            state.resourceChats[index].media[mediaIndex].resource = true;
          }
        } else {
           const mediaItem = response.chat.media?.find(
              (item) => item._id === response.mediaId
            );

            const chatData = {
              ...response.chat,
              media: mediaItem ? [mediaItem] : [],
            };

            state.resourceChats.push(chatData);
        }
      })
      .addCase(createChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) {
          const chat = response.chat;
          state.chats.push(chat);
        }
      })
      .addCase(createChatPoll.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success) {
          const chat = response.chat;
          state.chats.push(chat);
        }
      })

      .addCase(editChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) {
          const chat = response.chat;
          console.log(chat);
          let index = state.chats.findIndex((item) => item._id === chat._id);
          if (index !== -1) {
            state.chats[index] = chat;
          }
        }
      })
      .addCase(pushToResource.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(removeFromResource.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(removeFromResource.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const mediaData = action.payload;
        let index = state.resourceChats.findIndex(
          (item) => item._id === mediaData.chatId
        );
        if (index !== -1) {
          let mediaIndex = state.resourceChats[index].media.findIndex(
            (item) => item._id === mediaData.mediaId
          );
          if (mediaIndex !== -1) {
            state.resourceChats[index].media[mediaIndex].resource = false;
          } else {
            state.resourceChats.splice(index, 1);
          }
        }
      })
      .addCase(removeFromResource.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(createTopicChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(createTopicChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        state.chats.push(action.payload);
      })
      .addCase(createTopicChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(createBrandChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(createBrandChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        state.brandChats.push(action.payload);
      })
      .addCase(createBrandChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.chats.findIndex((item) => item._id === data.chatId);
        if (index !== -1) {
          state.chats[index].reactions = data.reaction;
        }
      })
      .addCase(deleteTopicChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(deleteTopicChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const id = action.payload;
        const index = state.chats.findIndex((item) => item._id === id);
        if (index !== -1) {
          state.chats.splice(index, 1);
        }
      })
      .addCase(deleteChatEvent.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const event = action.payload;
        let index = state.chats.findIndex((chat) => chat._id === event.chat);
        if (index !== -1) {
          state.chats.splice(index, 1);
        }
      })
      .addCase(pinChat.fulfilled, (state, action) => {
        const chat = action.payload;
        let index = state.pinnedChats.findIndex(
          (item) => item._id === chat._id
        );
        let index2 = state.chats.findIndex((item) => item._id === chat._id);
        if (index === -1) {
          state.pinnedChats.push(chat);
        }
        if (index2 !== -1) {
          state.chats[index2].pinned = chat.pinned;
        } else if (index !== -1) {
          state.pinnedChats.splice(index, 1);
        }
      })
      .addCase(pinChat.rejected, (state, action) => {
        state.chatError = action.payload || action.error.message;
      })
      .addCase(unpinChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        let index = state.pinnedChats.findIndex((item) => item._id === chatId);
        let index2 = state.chats.findIndex((item) => item._id === chatId);
        if (index !== -1) {
          state.pinnedChats.splice(index, 1);
        }
        if (index2 !== -1) {
          state.chats[index2].pinned = false;
        }
      })
      .addCase(unpinChat.rejected, (state, action) => {
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchPinnedChats.fulfilled, (state, action) => {
        state.pinnedLoading = false;
        state.pinnedChats = action.payload;
      })
      .addCase(fetchPinnedChats.rejected, (state, action) => {
        state.pinnedLoading = false;
        state.chatError = action.payload || action.error.message;
      })
      .addCase(fetchPinnedChats.pending, (state, action) => {
        state.pinnedLoading = true;
      })
      .addCase(deleteTopicChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
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
  reactionMessage,
  addBrandMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

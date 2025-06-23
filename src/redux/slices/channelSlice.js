import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { updateChannel } from "./channelItemsSlice";
import { createGeneralTopic } from "./channelItemsSlice";
import { removeMember } from "./reorderTopicSlice";

export const removeCover = createAsyncThunk(
  "channel/remove-cover",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/remove/channel/cover", {
        channelId,
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
export const saveCover = createAsyncThunk(
  "channel/save-cover",
  async (channel, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/save/channel/cover",
        channel
      );
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
export const fetchChannel = createAsyncThunk(
  "channel/fetch-channel",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/channel", {
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

export const createChannelInvite = createAsyncThunk(
  "channel/create-channel-invite",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/channel/invite",
        {
          channelId: id,
        }
      );
      if (response.success) {
        return response.invite;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinChannel = createAsyncThunk(
  "channel/join-channel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/join/channel", {
        channelId: id,
      });
      console.log(response)
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
export const leaveChannel = createAsyncThunk(
  "channel/leave-channel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/leave/channel", {
        channelId: id,
      });
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
export const joinChannelInvite = createAsyncThunk(
  "channel/join-channel-invite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/join/channel/invite",
        data
      );
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

const initialState = {
  _id: "",
  name: "",
  visibility: "anyone",
  editability: "me",
  members: [],
  cover_image: null,
  admins: [],
  topics: [],
  logo: null,
  description: "",
  channelstatus: "idle",
  loading: false,
  channelNameError: false,
  isEdit: false,
  code: "",
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    // setSelectedUnsplashImage: (state, action) => {
    //   state.cover_image = action.payload;
    //   state.imageSource = "unsplash";
    // },
    setChannelItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setChannelField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    clearChannel: (state) => {
      state.name = "";
      state._id = "";
      state.visibility = "anyone";
      state.cover_image = null;
      state.logo = null;
      state.cover_image = null;
      state.visibility = [];
      state.admins = [];
      state.editability = "me";
      state.members = [];
      state.loading = false;
      state.topics = [];
      state.name = "";
      state.description = "";
      state.channelstatus = "idle";
      state.channelNameError = false;
      state.isEdit = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeCover.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(removeCover.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.cover_image = "";
      })
      .addCase(removeCover.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(saveCover.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(saveCover.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.cover_image = action.payload.cover_image;
      })
      .addCase(saveCover.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createGeneralTopic.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const topic = action.payload;
        state.topics.unshift(topic._id);
      })
      .addCase(fetchChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannel.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, initialState, action.payload);
      })
      .addCase(fetchChannel.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(joinChannel.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if(response.success && state._id===response.channel._id){
          const membership = response.membership;
          let index = state.members.findIndex(m=>m._id===membership._id);
          if(index===-1){
            state.members.push(membership);
          }
          else{
            state.members[index]=membership;
          }
        }
      })
      .addCase(joinChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
      })
      .addCase(leaveChannel.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if(response.success && state._id===response.channel._id){
          const membership = response.membership;
          let index = state.members.findIndex(m=>m._id===membership._id);
          if(index!==-1){
            state.members.splice(index, 1);
          }
        }
      })
      .addCase(leaveChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        if (state._id === removeData.channelId) {
          let memberIndex = state.members.findIndex(
            (member) => member === removeData.userId
          );
          if (memberIndex !== -1) {
            state.members.splice(memberIndex, 1);
          }
        }
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        if (action.payload._id === state._id) {
          Object.assign(state, initialState, action.payload);
        }
      });
  },
});

export const {
  setSelectedUnsplashImage,
  setChannelField,
  clearChannel,
  setChannelItems,
} = channelSlice.actions;

export default channelSlice.reducer;

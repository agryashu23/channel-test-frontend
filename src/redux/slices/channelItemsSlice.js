import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";
import { updateTopicsOrder, removeMember, joinTopic ,leaveTopic} from "./reorderTopicSlice";
import { deleteTopic } from "./deleteTopicSlice";
import { joinChannel, leaveChannel } from "./channelSlice";

export const createChannel = createAsyncThunk(
  "channel/create-channel",
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel",
        channelData
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
export const updateChannel = createAsyncThunk(
  "channel/update-channel",
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/update/channel",
        channelData
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
export const createGeneralTopic = createAsyncThunk(
  "channel/create-general-topic",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/create/general/topic", {
        channelId,
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
export const fetchMyChannels = createAsyncThunk(
  "channel/fetch-my-channels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/my/channels");
      if (response.success) {
        return response.channels;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchChannels = createAsyncThunk(
  "channel/fetch-channels",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/channels", {
        username,
      });
      if (response.success) {
        return response.channels;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCommunityChannel = createAsyncThunk(
  "channel/fetch-community-channels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/community/channel"
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

const channelItemsSlice = createSlice({
  name: "channelItems",
  initialState: {
    channels: [],
    userChannels: [],
    selectedChannel: null,
    channelstatus: "idle",
    createChannelStatus: "idle",
    topicstatus: "idle",
    selectedPage: null,
    loading: false,
    error: null,
    fetchedChannelsOnce:false,
    communityChannel: null,
  },
  reducers: {
    setSelectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    setChannelOnce: (state, action) => {
      state.channelOnce = action.payload;
    },
    clearchannels: (state) => {
      state.channels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGeneralTopic.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(createGeneralTopic.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          state.channels[index].topics.unshift(topic);
        }
         let index2 = state.userChannels.findIndex(
           (item) => item._id === topic.channel
         );
         if (index2 !== -1) {
           state.userChannels[index2].topics.unshift(topic);
         }
      })
      .addCase(createGeneralTopic.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createChannel.pending, (state) => {
        state.createChannelStatus = "loading";
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.createChannelStatus = "idle";
        state.channels.unshift(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.createChannelStatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(updateChannel.pending, (state) => {
        state.createChannelStatus = "loading";
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.createChannelStatus = "idle";
        const channel = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === channel._id
        );
        if (index !== -1) {
          state.channels[index] = channel;
        }
        let index2 = state.userChannels.findIndex(
          (item) => item._id === channel._id
        );
        if (index2 !== -1) {
          state.userChannels[index2] = channel;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.createChannelStatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })

      .addCase(joinChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if(response.success){
          const membership = response.membership;
          const index = state.channels.findIndex(
            (item) => item._id === response.channel._id
          );
          const index2 = state.userChannels.findIndex(
            (item) => item._id === response.channel._id
          );
          if(index!==-1){
            const memInd = state.channels[index].members.findIndex(
              (member) => member._id === membership._id
            );
            if(memInd===-1){
              state.channels[index].members.push(membership);
            }
            else{
              state.channels[index].members[memInd] = membership;
            }
          }
          // if(index2!==-1){
          //   const memInd2 = state.userChannels[index2].members.findIndex(
          //     (member) => member._id === membership._id
          //   );
          //   if(memInd2===-1){
          //     state.userChannels[index2].members.push(membership);
          //   }
          //   else{
          //     state.userChannels[index2].members[memInd2] = membership;
          //   }
          // }
          if (
            index2 === -1 &&
            membership.status === "joined" &&
            response.joinStatus === "first"
          ) {
           state.userChannels.push(response.channel);
          }
        }
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if(response.success){
          const membership = response.membership;
          const index = state.channels.findIndex(
            (item) => item._id === response.channel._id
          );
          const index2 = state.userChannels.findIndex(
            (item) => item._id === response.channel._id
          );
          if(index!==-1){
            const memInd = state.channels[index].members.findIndex(
              (member) => member._id === membership._id
            );
            if(memInd!==-1){
              state.channels[index].members.splice(memInd, 1);
            }
          }
          if(index2!==-1){
            state.userChannels.splice(index2, 1);
          }
        }
      })
      .addCase(fetchMyChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.userChannels = action.payload;
        state.fetchedChannelsOnce = true;
      })
      .addCase(fetchMyChannels.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })

      // .addCase(fetchEmbedChannels.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchEmbedChannels.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.channels = action.payload;
      // })
      // .addCase(fetchEmbedChannels.rejected, (state, action) => {
      //   state.loading = false;
      //   state.channelNameError = action.payload || action.error.message;
      // })
      // .addCase(fetchUserChannels.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchUserChannels.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.userChannels = action.payload;
      // })
      // .addCase(fetchUserChannels.rejected, (state, action) => {
      //   state.loading = false;
      //   state.channelNameError = action.payload || action.error.message;
      // })
      .addCase(fetchCommunityChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunityChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.communityChannel = action.payload;
      })
      .addCase(fetchCommunityChannel.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(updateTopicsOrder.fulfilled, (state, action) => {
        state.status = "idle";
        const topicData = action.payload;
        const channelId = topicData.channelId;
        const topics = topicData.topics;
        let index = state.channels.findIndex((item) => item._id === channelId);
        if (index !== -1) {
          state.channels[index].topics = topics;
        }
        let index2 = state.userChannels.findIndex((item) => item._id === channelId);
        if (index2 !== -1) {
          state.userChannels[index2].topics = topics;
        }
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          state.channels[index].topics.push(topic);
        }
        let index2 = state.userChannels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index2 !== -1) {
          state.userChannels[index2].topics.push(topic);
        }
      })
      .addCase(updateTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        let index2 = state.userChannels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          const topicIndex = state.channels[index].topics.findIndex(
            (item) => item._id === topic._id
          );
          state.channels[index].topics[topicIndex]= topic;
        }
        if (index2 !== -1) {
          const topicIndex2 = state.userChannels[index2].topics.findIndex(
            (item) => item._id === topic._id
          );
          state.userChannels[index2].topics[topicIndex2] = topic;
        }
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        let index2 = state.userChannels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          const topicIndex = state.channels[index].topics.findIndex(
            (item) => item._id === topic._id
          );
          state.channels[index].topics.splice(topicIndex, 1);
        }
        if (index2 !== -1) {
          const topicIndex2 = state.userChannels[index2].topics.findIndex(
            (item) => item._id === topic._id
          );
          state.userChannels[index2].topics.splice(topicIndex2, 1);
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let channelIndex = state.channels.findIndex(
          (channel) => channel._id === removeData.channel
        );
        if (channelIndex !== -1) {
          let memberIndex = state.channels[channelIndex].members.findIndex(
            (member) => member === removeData.user
          );
          if (memberIndex !== -1) {
            state.channels[channelIndex].members.splice(memberIndex, 1);
          }
        }
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
      })
      .addCase(joinTopic.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if(response.success && response.membership.status==="joined"){
          const index = state.userChannels.findIndex(
            (channel) => channel._id === response.topic.channel
          );
          if(index!==-1){
            const topicIndex = state.userChannels[index].topics.findIndex(
              (topic) => topic._id.toString() === response.topic._id.toString()
            );
            if(topicIndex===-1){
              state.userChannels[index].topics.push(response.topic);
            }
          }
        }
      })
      .addCase(leaveTopic.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if(response.success){
          const index = state.userChannels.findIndex(
            (channel) => channel._id === response.topic.channel
          );
          if(index!==-1){
            const topicIndex = state.userChannels[index].topics.findIndex(
              (topic) => topic._id.toString() === response.topic._id.toString()
            );
            if(topicIndex!==-1){
              state.userChannels[index].topics.splice(topicIndex, 1);
            }
          }
        }
      });
  },
});

export const { setSelectedCuration, setError, clearCurationChips,setChannelOnce } =
  channelItemsSlice.actions;

export default channelItemsSlice.reducer;

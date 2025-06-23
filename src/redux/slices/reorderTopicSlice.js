// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";
import { deleteTopic } from "./deleteTopicSlice";
import { leaveChannel,joinChannel } from "./channelSlice";

export const fetchTopics = createAsyncThunk(
  "reorderTopics/fetchChannelTopics",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/channel/topics", {
        channelId,
      });
      if (response.success) {
        return response.topics;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOtherTopics = createAsyncThunk(
  "topic/fetch-other-topics",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/other/topics",
        data
      );
      if (response.success) {
        return response.topics;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchMembers = createAsyncThunk(
  "reorderTopics/fetchChannelMembers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/channel/members",
        {
          channelId,
        }
      );
      if (response.success) {
        return response.members;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeMember = createAsyncThunk(
  "reorderTopics/removeMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/channel/member",
        data
      );
      if (response.success) {
        return response.member;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTopicsOrder = createAsyncThunk(
  "reorderTopics/updateTopicsOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/channel/topics/order",
        data
      );
      const topicData = {
        topics: response.topics,
        channelId: response.channelId,
      };
      if (response.success) {
        return topicData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinTopic = createAsyncThunk(
  "reorderTopics/joinTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/join/topic",
        {topicId:topicId}
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

export const leaveTopic = createAsyncThunk(
  "reorderTopics/leaveTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/leave/topic",
        {topicId:topicId}
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

const initialState = {
  topics: [],
  members: [],
  topicMembers:[],
  removeChannelId: "",
  removeUser: {},
  status: "idle",
  memberStatus: "idle",
  error: false,
  otherTopics: [],
  reorderStatus: "idle",
};

export const reorderTopicSlice = createSlice({
  name: "reorderTopic",
  initialState,
  reducers: {
    setReorderTopicField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearItems: (state) => {
      state.status = "idle";
      state.error = null;
    },
    clearRemovalDelete: (state) => {
      state.removeUser = {};
      state.removeChannelId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = "idle";
        state.topics = action.payload;
      })
      .addCase(fetchOtherTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOtherTopics.fulfilled, (state, action) => {
        state.status = "idle";
        state.otherTopics = action.payload;
      })
      .addCase(fetchMembers.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.members = action.payload;
      })
      .addCase(removeMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let memberIndex = state.members.findIndex(
          (member) => member._id === removeData.userId
        );
        if (memberIndex !== -1) {
          state.members.splice(memberIndex, 1);
        }
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.status = "idle";
        state.topics.push(action.payload);
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let topicIndex = state.topics.findIndex(
          (item) => item._id === topic._id
        );
        state.topics[topicIndex] = topic;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let topicIndex = state.topics.findIndex(
          (item) => item._id === topic._id
        );
        state.topics.splice(topicIndex, 1);
      })
      .addCase(updateTopicsOrder.pending, (state) => {
        state.reorderStatus = "loading";
      })
      .addCase(updateTopicsOrder.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const topicData = action.payload;
        state.topics = topicData.topics;
      })
      .addCase(joinTopic.pending, (state) => {
        state.reorderStatus = "loading";
      })
      .addCase(joinTopic.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if(response.success){
          const index = state.topics.findIndex(
            (topic) => topic._id === response.membership.topic
          );
          if(index!==-1){
            const memInd = state.topics[index].members.findIndex(
              (member) => member._id === response.membership._id
            );
            if(memInd===-1){
              state.topics[index].members.push(response.membership);
            }
            else{
              state.topics[index].members[memInd] = response.membership;
            }
          }
        }
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        const memberships = response.topics;
        if(response.success){
          const topicToMembershipMap = {};
          memberships.forEach(({ topic, _id }) => {
            if (!topicToMembershipMap[topic]) {
              topicToMembershipMap[topic] = new Set();
            }
            topicToMembershipMap[topic].add(_id);
          });

          state.topics.forEach((topic) => {
            const topicId = String(topic._id);
            if (topicToMembershipMap[topicId]) {
              topic.members = topic.members.filter(
                (member) => !topicToMembershipMap[topicId].has(member._id)
              );
            }
          });
        }
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if (!response.success) return;
        const topicIdsSet = new Set(response.topics);
        const membership = response.membership;
        state.topics.forEach(topic => {
          if (topicIdsSet.has(topic._id)) {
            const index = topic.members.findIndex(member => member._id === membership._id);
            if (index === -1) {
              topic.members.push(membership);
            } else {
              topic.members[index] = membership;
            }
          }
        });
      })
      .addCase(joinTopic.rejected, (state, action) => {
        state.reorderStatus = "idle";
        state.error = action.payload;
      })
      .addCase(leaveTopic.pending, (state) => {
        state.reorderStatus = "loading";
      })
      .addCase(leaveTopic.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if(response.success){
          const index = state.topics.findIndex(
            (topic) => topic._id === response.topic._id
          );
          if(index!==-1){
            const memInd = state.topics[index].members.findIndex(
              (member) => member._id === response.membership._id
            );
            if(memInd!==-1){
              state.topics[index].members.splice(memInd, 1);
            }
          }
        }
      })
      .addCase(leaveTopic.rejected, (state, action) => {
        state.reorderStatus = "idle";
        state.error = action.payload;
      });
  },
});

export const { clearItems, setReorderTopicField, clearRemovalDelete } =
  reorderTopicSlice.actions;

export default reorderTopicSlice.reducer;

// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";
import { createGeneralTopic } from "./channelItemsSlice";
import { deleteTopic } from "./deleteTopicSlice";
import { leaveChannel, joinChannel, joinChannelInvite } from "./channelSlice";
import { joinTopicInvite } from "./topicSlice";
import { verifyPayment } from "./paymentSlice";
import { markAsRead } from "./chatSlice";
import {
  acceptChannelRequest,
  declineChannelRequest,
  acceptTopicRequest,
  declineTopicRequest,
} from "./businessSlice";

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

export const fetchMyTopics = createAsyncThunk(
  "topic/fetch-my-topics",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/my/channel/topics",
        { channelId }
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
export const fetchChannelMembers = createAsyncThunk(
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
export const fetchChannelRequests = createAsyncThunk(
  "reorderTopics/fetchChannelRequests",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/channel/requests",
        {
          channelId,
        }
      );
      console.log(response);
      if (response.success) {
        return response.requests;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchTopicMembers = createAsyncThunk(
  "reorderTopics/fetchTopicMembers",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/topic/members", {
        topicId: topicId,
      });
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
export const fetchTopicRequests = createAsyncThunk(
  "reorderTopics/fetchTopicRequests",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/topic/requests", {
        topicId: topicId,
      });
      if (response.success) {
        return response.requests;
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
      console.log(response);
      if (response.success) {
        return response.membership;
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
      console.log(response);
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
      const response = await postRequestAuthenticated("/join/topic", {
        topicId: topicId,
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

export const leaveTopic = createAsyncThunk(
  "reorderTopics/leaveTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/leave/topic", {
        topicId: topicId,
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

export const removeTopicMember = createAsyncThunk(
  "reorderTopics/removeTopicMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/topic/member",
        data
      );
      if (response.success) {
        return response.membership;
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
  topicMembers: [],
  channelMembers: [],
  myTopicsFetchedOnce: false,
  membersFetchedOnce: false,
  topicMembersFetchedOnce: false,
  requestsFetchedOnce: false,
  topicRequestsFetchedOnce: false,
  channelRequests: [],
  topicRequests: [],
  removeChannelId: "",
  removeTopicId: "",
  removeUser: {},
  status: "idle",
  memberStatus: "idle",
  error: false,
  myTopics: [],
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
      state.removeTopicId = "";
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
      .addCase(fetchMyTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyTopics.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(fetchMyTopics.fulfilled, (state, action) => {
        state.status = "idle";
        state.myTopicsFetchedOnce = true;
        state.myTopics = action.payload;
      })
      .addCase(fetchChannelMembers.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchChannelMembers.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.membersFetchedOnce = true;
        state.channelMembers = action.payload;
      })
      .addCase(fetchChannelRequests.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchChannelRequests.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.requestsFetchedOnce = true;
        state.channelRequests = action.payload;
      })
      .addCase(fetchTopicMembers.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchTopicMembers.rejected, (state) => {
        state.memberStatus = "idle";
      })
      .addCase(fetchTopicMembers.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.topicMembersFetchedOnce = true;
        state.topicMembers = action.payload;
      })
      .addCase(fetchTopicRequests.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchTopicRequests.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.topicRequestsFetchedOnce = true;
        state.topicRequests = action.payload;
      })
      .addCase(removeMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let memberIndex = state.channelMembers.findIndex(
          (member) => member?._id === removeData._id
        );
        if (memberIndex !== -1) {
          state.channelMembers.splice(memberIndex, 1);
        }
      })

      .addCase(acceptChannelRequest.fulfilled, (state, action) => {
        state.status = "idle";
        const acceptData = action.payload;
        let requestIndex = state.channelRequests.findIndex(
          (request) =>
            request?.channel._id === acceptData.channelId &&
            request?.user._id === acceptData.userId
        );
        if (requestIndex !== -1) {
          state.channelRequests.splice(requestIndex, 1);
          state.channelMembers.push(acceptData.membership);
        }
      })
      .addCase(declineChannelRequest.fulfilled, (state, action) => {
        state.status = "idle";
        const acceptData = action.payload;
        let requestIndex = state.channelRequests.findIndex(
          (request) =>
            request?.channel._id === acceptData.channelId &&
            request?.user._id === acceptData.userId
        );
        if (requestIndex !== -1) {
          state.channelRequests.splice(requestIndex, 1);
        }
      })

      .addCase(acceptTopicRequest.fulfilled, (state, action) => {
        state.status = "idle";
        const data = action.payload;
        const index = state.topicRequests.findIndex(
          (req) =>
            req.topic._id === data.topicId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.topicRequests.splice(index, 1);
          state.topicMembers.push(data.membership);
        }
      })
      .addCase(declineTopicRequest.fulfilled, (state, action) => {
        state.status = "idle";
        const data = action.payload;
        const index = state.topicRequests.findIndex(
          (req) =>
            req.topic._id === data.topicId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.topicRequests.splice(index, 1);
        }
      })

      .addCase(createTopic.fulfilled, (state, action) => {
        state.status = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) {
          const topic = response.topic;
          state.topics.push(topic);
        }
      })
      .addCase(createGeneralTopic.fulfilled, (state, action) => {
        state.status = "idle";
        state.topics.push(action.payload);
      })

      .addCase(updateTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const response = action.payload;
        if (response.success && !response.limitReached) { 
          const topic = response.topic;
          let topicIndex = state.topics.findIndex(
            (item) => item?._id === topic._id
          );
          state.topics[topicIndex] = topic;
        }
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let topicIndex = state.topics.findIndex(
          (item) => item?._id === topic._id
        );
        state.topics.splice(topicIndex, 1);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.status = "idle";
        const topicId = action.payload.topicId;
        const topicIndex = state.myTopics.findIndex(
          (topic) => topic?._id === topicId
        );
        if (topicIndex !== -1) {
          state.myTopics[topicIndex].unreadCount = 0;
        }
      })
      .addCase(updateTopicsOrder.pending, (state) => {
        state.reorderStatus = "loading";
      })
      .addCase(updateTopicsOrder.rejected, (state) => {
        state.reorderStatus = "idle";
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
        if (response.success && response.membership) {
          const index = state.topics.findIndex(
            (topic) => topic?._id === response.membership.topic
          );
          if (index !== -1) {
            const memInd = state.topics[index].members.findIndex(
              (member) => member?._id === response.membership._id
            );
            if (memInd === -1) {
              state.topics[index].members.push(response.membership);
            } else {
              state.topics[index].members[memInd] = response.membership;
            }
          }
        }
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if (
          response.type === "topic" &&
          response.success &&
          response.membership
        ) {
          const index = state.topics.findIndex(
            (topic) => topic?._id === response.membership.topic
          );
          if (index !== -1) {
            const memInd = state.topics[index].members.findIndex(
              (member) => member?._id === response.membership._id
            );
            if (memInd === -1) {
              state.topics[index].members.push(response.membership);
            } else {
              state.topics[index].members[memInd] = response.membership;
            }
          }
        }
        if (
          response.type === "channel" &&
          response.success &&
          response.membership
        ) {
          const topicIdsSet = new Set(response.topics);
          const membership = response.membership;
          state.topics.forEach((topic) => {
            if (topicIdsSet.has(topic?._id)) {
              const index = topic.members.findIndex(
                (member) => member?._id === membership._id
              );
              if (index === -1) {
                topic.members.push(membership);
              } else {
                topic.members[index] = membership;
              }
            }
          });
        }
      })
      .addCase(joinTopicInvite.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const response = action.payload;
        if (response.success && response.topicMembership) {
          let index = state.topics.findIndex(
            (m) => m?._id === response.topic._id
          );
          if (index !== -1) {
            const memInd = state.topics[index].members.findIndex(
              (member) => member?._id === response.topicMembership._id
            );
            if (memInd === -1) {
              state.topics[index].members.push(response.topicMembership);
            } else {
              state.topics[index].members[memInd] = response.topicMembership;
            }
          } else {
            const topicData = {
              ...response.topic,
              members: [response.topicMembership],
            };
            state.topics.push(topicData);
          }
        }
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        const memberships = response.topics;
        if (response.success) {
          const topicToMembershipMap = {};
          memberships.forEach(({ topic, _id }) => {
            if (!topicToMembershipMap[topic]) {
              topicToMembershipMap[topic] = new Set();
            }
            topicToMembershipMap[topic].add(_id);
          });

          state.topics.forEach((topic) => {
            const topicId = String(topic?._id);
            if (topicToMembershipMap[topicId]) {
              topic.members = topic.members.filter(
                (member) => !topicToMembershipMap[topicId].has(member?._id)
              );
            }
          });
        }
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if (!response.success || !response.membership) return;
        const topicIdsSet = new Set(response.topics);
        const membership = response.membership;
        state.topics.forEach((topic) => {
          if (topicIdsSet.has(topic?._id)) {
            const index = topic.members.findIndex(
              (member) => member?._id === membership._id
            );
            if (index === -1) {
              topic.members.push(membership);
            } else {
              topic.members[index] = membership;
            }
          }
        });
      })

      .addCase(joinChannelInvite.fulfilled, (state, action) => {
        state.reorderStatus = "idle";
        const response = action.payload;
        if (!response.success) return;
        const topicIdsSet = new Set(response.topics);
        const membership = response.membership;
        state.topics.forEach((topic) => {
          if (topicIdsSet.has(topic?._id)) {
            const index = topic.members.findIndex(
              (member) => member?._id === membership._id
            );
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
        if (response.success) {
          const index = state.topics.findIndex(
            (topic) => topic?._id === response.topic?._id
          );
          if (index !== -1) {
            const memInd = state.topics[index].members.findIndex(
              (member) => member?._id === response.membership._id
            );
            if (memInd !== -1) {
              state.topics[index].members.splice(memInd, 1);
            }
          }
        }
      })
      .addCase(leaveTopic.rejected, (state, action) => {
        state.reorderStatus = "idle";
        state.error = action.payload;
      })
      .addCase(removeTopicMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeTopicMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let memberIndex = state.topicMembers.findIndex(
          (member) => member?._id === removeData._id
        );
        if (memberIndex !== -1) {
          state.topicMembers.splice(memberIndex, 1);
        }
      })
      .addCase(removeTopicMember.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const { clearItems, setReorderTopicField, clearRemovalDelete } =
  reorderTopicSlice.actions;

export default reorderTopicSlice.reducer;

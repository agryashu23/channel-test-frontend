import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const fetchBusinessCredentials = createAsyncThunk(
  "business/fetchcredentials",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/business/credentials`,
        {
          username: username,
        }
      );
      if (response.success) {
        return response.business;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchBusinessChannelRequests = createAsyncThunk(
  "business/fetchBusinessChannelRequests",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/business/channel/requests`
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
export const fetchBusinessTopicRequests = createAsyncThunk(
  "business/fetchBusinessTopicRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/business/topic/requests`
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
export const fetchEventRequests = createAsyncThunk(
  "business/fetchevent-requests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/event/requests`
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
export const makeAutoLoginRequest = createAsyncThunk(
  "business/autoLoginrequest",
  async (apiKey, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(`/request/login/auto`, {
        apiKey: apiKey,
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
export const acceptChannelRequest = createAsyncThunk(
  "business/acceptChannelRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/accept/channel/request`,
        data
      );
      if (response.success) {
        const newData = {
          channelId: response.channelId,
          userId: response.userId,
          membership:response.membership
        };
        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const declineChannelRequest = createAsyncThunk(
  "business/declineChannelRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/decline/channel/request`,
        data
      );

      if (response.success) {
        const newData = {
          channelId: response.channelId,
          userId: response.userId,
        };

        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptTopicRequest = createAsyncThunk(
  "business/acceptTopicRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/accept/topic/request`,
        data
      );
      if (response.success) {
        const newData = {
          topicId: response.topicId,
          userId: response.userId,
          membership:response.membership
        };
        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const declineTopicRequest = createAsyncThunk(
  "business/declineTopicRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/decline/topic/request`,
        data
      );
      if (response.success) {
        const newData = {
          topicId: response.topicId,
          userId: response.userId,
        };

        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptEventRequest = createAsyncThunk(
  "business/acceptEventRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/accept/event/request`,
        data
      );
      if (response.success) {
        const newData = {
          eventId: response.eventId,
          userId: response.userId,
        };
        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const declineEventRequest = createAsyncThunk(
  "business/declineEventRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/decline/event/request`,
        data
      );
      if (response.success) {
        const newData = {
          eventId: response.eventId,
          userId: response.userId,
        };
        return newData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBusinessCustomizations = createAsyncThunk(
  "business/updateBusinessCustomizations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/update/business/customizations`,
        data
      );
      if (response.success) {
        return response.business;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchBusinessRolesMembers = createAsyncThunk(
  "business/fetchBusinessRolesMembers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/business/roles/members`,
        data
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
export const updateUserBusinessRole = createAsyncThunk(
  "business/updateUserBusinessRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/update/user/business/role`,
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
export const removeUserBusinessMember = createAsyncThunk(
  "business/removeUserBusinessMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/remove/user/business/member`,
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
export const fetchBusinessChannelsTopics = createAsyncThunk(
  "business/fetchBusinessChannelsTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/business/channels/topics`,
      );
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
export const fetchBusinessNotifications = createAsyncThunk(
  "business/fetchBusinessNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/business/notifications`,
      );
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
export const updateBusinessNotification = createAsyncThunk(
  "business/updateBusinessNotification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/update/business/notification`,
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

const businessSlice = createSlice({
  name: "business",
  initialState: {
    business: {},
    channelRequests: [],
    notifications:[],
    members:[],
    channels:[],
    topicRequests:[],
    eventRequests:[],
    events:[],
    loading: false,
    notificationLoading:false,
    customLoading:false,
    error: null,
  },
  reducers: {
    setBusinessField: (state, action) => {
      const { field, value } = action.payload;
    if (!state.business.parameters) {
      state.business.parameters = {};
    }
      state.business[field] = value;
    },
    setBusinessParameterField: (state, action) => {
      const { field, value } = action.payload;
      state.business.parameters[field] = value;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearBusiness: (state) => {
      state.business ={};
    },
    clearMembers: (state) => {
      state.members = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.business = action.payload;
      })
      .addCase(fetchBusinessCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBusinessCustomizations.pending, (state) => {
        state.customLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessCustomizations.fulfilled, (state, action) => {
        state.customLoading = false;
        state.business = action.payload;
      })
      .addCase(updateBusinessCustomizations.rejected, (state, action) => {
        state.customLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessChannelRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessChannelRequests.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        state.channelRequests = response.requests;
        state.channels = response.channels;
      })
      .addCase(fetchBusinessChannelRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchBusinessTopicRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessTopicRequests.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        state.topicRequests = response.requests;
        state.channels = response.channels;
      })
      .addCase(fetchBusinessTopicRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchEventRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventRequests.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        state.eventRequests = response.requests;
        state.events = response.events;
      })
      .addCase(fetchEventRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(acceptChannelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptChannelRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.channelRequests.findIndex(
          (req) => req.channel._id === data.channelId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.channelRequests.splice(index, 1);
        }
      })
      
      .addCase(acceptChannelRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(declineChannelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineChannelRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.channelRequests.findIndex(
          (req) => req.channel._id === data.channelId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.channelRequests.splice(index, 1);
        }
      })
      .addCase(declineChannelRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptTopicRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptTopicRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.topicRequests.findIndex(
          (req) => req.topic._id === data.topicId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.topicRequests.splice(index, 1);
        }
      })
      
      .addCase(acceptTopicRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(declineTopicRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineTopicRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.topicRequests.findIndex(
          (req) => req.topic._id === data.topicId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.topicRequests.splice(index, 1);
        }
      })
      .addCase(declineTopicRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptEventRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptEventRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.eventRequests.findIndex(
          (req) => req.event === data.eventId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.eventRequests.splice(index, 1);
        }
      })
      .addCase(declineEventRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineEventRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.eventRequests.findIndex(
          (req) => req.event === data.eventId && req.user._id === data.userId
        );
        if (index !== -1) {
          state.eventRequests.splice(index, 1);
        }
      })
      .addCase(declineEventRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(acceptEventRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessRolesMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessRolesMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchBusinessRolesMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessNotifications.pending, (state) => {
        state.notificationLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessNotifications.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchBusinessNotifications.rejected, (state, action) => {
        state.notificationLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBusinessNotification.pending, (state) => {
        state.customLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessNotification.fulfilled, (state, action) => {
        state.customLoading = false;
        const response = action.payload;
        if(response.success){
          let index = state.notifications.findIndex((item)=>item._id===response.notificationId);
          if(index!==-1){
            state.notifications[index].action = true;
          }
        }
      })
      .addCase(updateBusinessNotification.rejected, (state, action) => {
        state.customLoading = false;
        state.error = action.payload;
      })

      .addCase(updateUserBusinessRole.pending, (state) => {
        state.customLoading = true;
        state.error = null;
      })
      .addCase(updateUserBusinessRole.fulfilled, (state, action) => {
        state.customLoading = false;
        const data = action.payload;
        const index = state.members.findIndex(
          (member) => member.user._id === data.user
        );
        if (index !== -1) {
          state.members[index].role = data.role;
        }
      })
      .addCase(updateUserBusinessRole.rejected, (state, action) => {
        state.customLoading = false;
        state.error = action.payload;
      })
      .addCase(removeUserBusinessMember.pending, (state) => {
        state.customLoading = true;
        state.error = null;
      })
      .addCase(removeUserBusinessMember.fulfilled, (state, action) => {
        state.customLoading = false;
        const data = action.payload;
        const index = state.members.findIndex(
          (member) => member.user._id === data.userId
        );
        if (index !== -1) {
          state.members.splice(index, 1);
        }
      })
      .addCase(removeUserBusinessMember.rejected, (state, action) => {
        state.customLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessChannelsTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessChannelsTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchBusinessChannelsTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(makeAutoLoginRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeAutoLoginRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.business.auto_login_request = true;
      })
      .addCase(makeAutoLoginRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBusinessField,setBusinessParameterField, setError, clearBusiness, clearMembers } =
  businessSlice.actions;

export default businessSlice.reducer;

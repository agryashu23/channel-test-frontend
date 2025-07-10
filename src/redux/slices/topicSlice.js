// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { updateTopic } from "./createTopicSlice";

export const fetchTopic = createAsyncThunk(
  "topic/fetch-topic",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/topic", {
        id: id,
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

export const createTopicInvite = createAsyncThunk(
  "topic/create-topic-invite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/topic/invite",
        data
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

export const joinTopicInvite = createAsyncThunk(
  "topic/join-topic-invite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/join/topic/invite",
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
export const visitTopic = createAsyncThunk(
  "topic/visit-topic",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/visit/topic", {
        topicId: topicId,
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
// export const fetchTopicSubscription = createAsyncThunk(
//   "topic/fetchTopicSubscription",
//   async (topicId, { rejectWithValue }) => {
//     try {
//       const response = await postRequestUnAuthenticated(
//         "/fetch/topic/subscription",
//         {
//           topic: topicId,
//         }
//       );
//       if (response.success) {
//         return response;
//       } else {
//         return rejectWithValue(response.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const initialState = {
  _id: "",
  name: "",
  user: {},
  visibility: "anyone",
  channel: {},
  description: "",
  pinnedChat: "",
  editability: "anyone",
  topicstatus: "idle",
  members: [],
  paywallPrice: "",
  whatsappEnabled: false,
  summaryEnabled: false,
  summaryType: "",
  summaryTime: "",
  topicNameError: false,
  loading: false,
  code: "",
  business: "",
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopicField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearTopic: (state) => {
      state.name = "";
      state.visibility = "anyone";
      state.channel = {};
      state.editability = "anyone";
      state._id = "";
      state.topicstatus = "idle";
      state.topicNameError = false;
      state.members = [];
      state.user = {};
      state.description = "";
      state.pinnedChat = "";
      state.paywallPrice = "";
      state.whatsappEnabled = false;
      state.summaryEnabled = false;
      state.summaryType = "";
      state.summaryTime = "";
      state.business = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(fetchTopic.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.topicstatus = "idle";
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.success && !response.limitReached) {
          Object.assign(state, initialState, response.topic);
          state.topicstatus = "idle";
        }
      })
      .addCase(fetchTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
        state.topicNameError = action.payload || action.error.message;
      })
      .addCase(joinTopicInvite.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const response = action.payload;
        if (
          response.success &&
          state._id === response.topic._id &&
          response.topicMembership
        ) {
          let index = state.members.findIndex(
            (m) => m?._id === response.topicMembership._id
          );
          if (index !== -1) {
            state.members[index] = response.topicMembership;
          } else {
            state.members.push(response.topicMembership);
          }
        }
      })
      .addCase(visitTopic.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.topicstatus = "idle";
        state.channel = action.payload.channel;
      });
  },
});

export const { setSelectedUnsplashImage, setTopicField, clearTopic } =
  topicSlice.actions;

export default topicSlice.reducer;

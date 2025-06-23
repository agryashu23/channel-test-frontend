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
      const response = await postRequestUnAuthenticated("/fetch/topic", {
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
        return response.topic;
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
  name: "",
  user: "",
  visibility: "anyone",
  channel: {},
  editability: "me",
  allowedVisibleUsers: [],
  allowedEditUsers: [],
  _id: "",
  topicstatus: "idle",
  topicNameError: false,
  loading: false,
  code: "",
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
      state.allowedVisibleUsers = [];
      state.allowedEditUsers = [];
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
        state.channel = action.payload.channel;
      })

      // .addCase(fetchTopicSubscription.fulfilled, (state, action) => {
      //   if ("subscription" in action.payload) {
      //     state.payment_subscription = action.payload.subscription;
      //   }
      //   if ("plan" in action.payload) {
      //     state.payment_plan = action.payload.plan;
      //   }
      // })

      .addCase(updateTopic.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.topicstatus = "idle";
      })
      .addCase(fetchTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
        state.topicNameError = action.payload || action.error.message;
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

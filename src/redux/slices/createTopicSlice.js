// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const createTopic = createAsyncThunk(
  "topic/create-topic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/topic",
        topicData
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
export const updateTopic = createAsyncThunk(
  "topic/update-topic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/topic",
        topicData
      );
      console.log(response);
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

const initialState = {
  name: "",
  user: "",
  visibility: "anyone",
  channel: "",
  editability: "anyone",
  _id: "",
  topicstatus: "idle",
  topicNameError: false,
  paywallPrice:0,
  isEdit: false,
};

export const createTopicSlice = createSlice({
  name: "createTopic",
  initialState,
  reducers: {
    setCreateTopicField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setCreateTopicItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearCreateTopic: (state) => {
      state.name = "";
      state.visibility = "anyone";
      state.channel = "";
      state.editability = "anyone";
      state._id = "";
      state.paywallPrice=0;
      state.topicstatus = "idle";
      state.topicNameError = false;
      state.isEdit = false;
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
      .addCase(fetchTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
        state.topicNameError = action.payload || action.error.message;
      });
  },
});

export const {
  setSelectedUnsplashImage,
  setCreateTopicField,
  clearCreateTopic,
  setCreateTopicItems,
} = createTopicSlice.actions;

export default createTopicSlice.reducer;

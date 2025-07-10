import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticatedWithFile,
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";

export const createChatPoll = createAsyncThunk(
  "poll/createPoll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/chat/poll",
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
export const createPrivatePollResponse = createAsyncThunk(
  "poll/privatePollResponse",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/private/poll/response",
        data
      );
      console.log(response);
      if (response.success) {
        return response.response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createPublicPollResponse = createAsyncThunk(
  "poll/publicPollResponse",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/create/public/poll/response",
        data
      );
      console.log(response);
      if (response.success) {
        return response.response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopicPollResponses = createAsyncThunk(
  "poll/fetchPollResponses",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/topic/poll/responses",
        {topicId:topicId}
      );
      console.log(response);
      if (response.success) {
        return response.responses;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPollData = createAsyncThunk(
  "poll/fetchPollData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/poll/data",
        data
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

export const deleteChatPoll = createAsyncThunk(
  "poll/fetchPollData",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/delete/chat/poll",
        {pollId:pollId}
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

const pollSlice = createSlice({
  name: "Poll",
  poll:{},
  initialState :{
  question: "",
  choices: ["", ""],
  type: "private",
  showResults: "afterVote",
  visibility: "anyone",
  topic: "",
  status: "idle",
  buttonStatus:"idle",
  responses:[],
  error: null,
  },
  reducers: {
    setPollItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPollField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearChatPoll: (state, action) => {
      state.question="";
      state.name="Poll";
      state.choices=["",""];
      state.question="";
      state.type="private";
      state.visibility="anyone";
      state.showResults="afterVote";
      state.topic="";
      state.status="idle";
      state.loading=false;
      state.error=null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatPoll.pending, (state) => {
        state.buttonStatus = "loading";
      })
      .addCase(createChatPoll.fulfilled, (state, action) => {
        state.buttonStatus = "idle";
      })
      .addCase(createChatPoll.rejected, (state, action) => {
        state.buttonStatus = "idle";
      })
       .addCase(fetchTopicPollResponses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopicPollResponses.fulfilled, (state, action) => {
        state.status = "idle";
        state.responses = action.payload;
      })
      .addCase(fetchTopicPollResponses.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(createPrivatePollResponse.pending, (state) => {
        state.buttonStatus = "loading";
      })
      .addCase(createPrivatePollResponse.fulfilled, (state, action) => {
        state.buttonStatus = "idle";
        const response =action.payload;
          let index = state.responses.findIndex((item)=>item.pollId===response.pollId);
          if(index===-1){
            state.responses.push(response);
          }
          else{
            state.responses[index] = response;
          }
      })
      .addCase(createPrivatePollResponse.rejected, (state, action) => {
        state.buttonStatus = "idle";
      })
      .addCase(createPublicPollResponse.pending, (state) => {
        state.buttonStatus = "loading";
      })
      .addCase(createPublicPollResponse.fulfilled, (state, action) => {
        state.buttonStatus = "idle";
        const response = action.payload;
          let index = state.responses.findIndex((item)=>item.pollId===response.pollId);
          if(index===-1){
            state.responses.push(response);
          }
          else{
            state.responses[index] = response;
          }
      })
      .addCase(createPublicPollResponse.rejected, (state, action) => {
        state.buttonStatus = "idle";
      })
      .addCase(fetchPollData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPollData.fulfilled, (state, action) => {
        state.status = "idle";
        const response = action.payload;
        if(response.success){
          state.poll = response.poll;
          state.responses = [response.response];
        }
      })
      .addCase(fetchPollData.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { setPollField, clearChatPoll, setPollItems } = pollSlice.actions;

export default pollSlice.reducer;

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
export const fetchChannelRequests = createAsyncThunk(
  "business/fetchchannel-requests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/fetch/channel/requests`
      );
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

const businessSlice = createSlice({
  name: "business",
  initialState: {
    business: {},
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCuration: (state, action) => {
      state.selectedCuration = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCurationChips: (state) => {
      state.chips = [];
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

      .addCase(fetchChannelRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchChannelRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptChannelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptChannelRequest.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const index = state.requests.findIndex(
          (req) => req._id === data.userId && req.channel_id === data.channelId
        );
        if (index !== -1) {
          state.requests.splice(index, 1);
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
        const index = state.requests.findIndex(
          (req) => req._id === data.userId && req.channel_id === data.channelId
        );
        if (index !== -1) {
          state.requests.splice(index, 1);
        }
      })
      .addCase(declineChannelRequest.rejected, (state, action) => {
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

export const { setSelectedCuration, setError, clearCurationChips } =
  businessSlice.actions;

export default businessSlice.reducer;

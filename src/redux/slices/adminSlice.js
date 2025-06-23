import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const fetchAdminEmails = createAsyncThunk(
  "admin/fetchemails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/get/admin/emails`);
      if (response.success) {
        return response.emails;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchAdminRequests = createAsyncThunk(
  "admin/fetchrequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(`/get/admin/requests`);
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
export const updateAdminRequests = createAsyncThunk(
  "admin/update-requests",
  async (requests, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        `/update/admin/requests`,
        { requests }
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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    emails: [],
    requests: [],
    loading: false,
    requestloading: false,
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
      .addCase(fetchAdminEmails.pending, (state) => {
        state.requestLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminEmails.fulfilled, (state, action) => {
        state.requestLoading = false;
        state.emails = action.payload;
      })
      .addCase(fetchAdminEmails.rejected, (state, action) => {
        state.requestLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAdminRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = adminSlice.actions;

export default adminSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { fetchProfileItems } from "./profileItemsSlice";

export const testNewsletter = createAsyncThunk(
  "newsletter/testNewsletter",
  async (testNewsletterData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/test/newsletter",
        testNewsletterData
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
export const sendNewsletter = createAsyncThunk(
  "newsletter/sendNewsletter",
  async (sendNewsletterData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/send/newsletter",
        sendNewsletterData
      );
      if (response.success) {
        return response.success;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getTestNewsletterLimit = createAsyncThunk(
  "newsletter/getTestNewsletterLimit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/get/test/newsletter/limit"
      );
      if (response.success) {
        return response.tested_times;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getNewsletterLimit = createAsyncThunk(
  "newsletter/getNewsletterLimit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/get/newsletter/limit");
      if (response.success) {
        return response.records;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    image: null,
    description: "",
    email: "",
    imageSource: "",
    items: [],
    selectedItems: [],
    status: "idle",
    teststatus: "idle",
    letterstatus: "idle",
    error: null,
    testerror: null,
    lettererror: null,
    tested_times: 0,
    records: [],
    recordStatus: "idle",
  },
  reducers: {
    setSelectedUnsplashImage: (state, action) => {
      state.image = action.payload;
      state.imageSource = "unsplash";
    },
    updateNewsletterField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    updateSelectedItems: (state, action) => {
      const { _id, type } = action.payload;
      const index = state.selectedItems.findIndex(
        (selected) => selected.id === _id && selected.type === type
      );
      if (index === -1) {
        if (state.selectedItems.length >= 5) {
          alert("You can select up to 5 items only.");
          return;
        }
        state.selectedItems.push({ id: _id, type });
      } else {
        state.selectedItems = state.selectedItems.filter(
          (selected) => selected.id !== _id || selected.type !== type
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(testNewsletter.pending, (state) => {
        state.teststatus = "loading";
      })
      .addCase(testNewsletter.rejected, (state, action) => {
        state.teststatus = "failed";
        state.error = action.payload;
      })
      .addCase(testNewsletter.fulfilled, (state, action) => {
        state.tested_times = 5 - action.payload.testing_times;
        state.teststatus = "succeeded";
      })
      .addCase(sendNewsletter.pending, (state) => {
        state.letterstatus = "loading";
      })
      .addCase(sendNewsletter.rejected, (state, action) => {
        state.letterstatus = "failed";
        state.lettererror = action.payload;
      })
      .addCase(sendNewsletter.fulfilled, (state, action) => {
        state.letterstatus = "succeeded";
      })
      .addCase(getTestNewsletterLimit.fulfilled, (state, action) => {
        state.tested_times = 5 - action.payload;
        state.status = "succeeded";
      })
      .addCase(getTestNewsletterLimit.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getNewsletterLimit.fulfilled, (state, action) => {
        state.records = action.payload;
        state.recordStatus = "succeeded";
      })
      .addCase(getNewsletterLimit.pending, (state, action) => {
        state.recordStatus = "loading";
      });
  },
});
export const {
  setSelectedUnsplashImage,
  updateNewsletterField,
  clearSelectedItems,
  updateSelectedItems,
} = newsletterSlice.actions;

export default newsletterSlice.reducer;

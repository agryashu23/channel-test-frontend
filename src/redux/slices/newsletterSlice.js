import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const sendNewsletter = createAsyncThunk(
  "newsletter/sendNewsletter",
  async (sendNewsletterData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/send/newsletter",
        sendNewsletterData
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
export const getNewsletterLimit = createAsyncThunk(
  "newsletter/getNewsletterLimit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/get/newsletter/limit"
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


export const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    contentBlocks:[],
    subject:"",
    channel:"all",
    limit:0,
    totalLimit:1,
    topic:"all",
    date:"",
    loading:false,
    time:"",
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
    clearNewsletterFields: (state) => {
      state.contentBlocks = [];
      state.subject = "";
      state.channel = "all";
      state.topic = "all";
      state.limit=0;
      state.totalLimit=1;
      state.loading=false;
      state.date = "";
      state.time = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNewsletter.pending, (state) => {
        state.loading=true;
      })
      .addCase(sendNewsletter.rejected, (state, action) => {
        state.loading=false;
        state.lettererror = action.payload;
      })
      .addCase(sendNewsletter.fulfilled, (state, action) => {
        state.loading=false;
        const response = action.payload;
        if(response.success && !response.limitReached){
          state.limit+=1;
        }
      })
      .addCase(getNewsletterLimit.fulfilled, (state, action) => {
        state.loading=false;
        const response = action.payload;
        state.limit = response.limit;
        state.totalLimit = response.totalLimit;
      })
      .addCase(getNewsletterLimit.pending, (state, action) => {
        state.loading=true;
      })
      .addCase(getNewsletterLimit.rejected, (state, action) => {
        state.loading=false;
      });
  },
});
export const {
  setSelectedUnsplashImage,
  updateNewsletterField,
  clearNewsletterFields,
} = newsletterSlice.actions;

export default newsletterSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateMyField } from "./myDataSlice";
import { setProfileEngagement } from "./profileEngagementSlice";

import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/gallery/username",
        { username }
      );
      if (response.success) {
        return response.user;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  _id: "",
  name: "",
  email: "",
  logo: "",
  username: "",
  description: "",
  links: [],
  location: "",
  contact: "",
  customText: "",
  customUrl: "",
  otherLink: "",
  imageCards: [],
  subscriptions: [],
  status: "idle",
  error: null,
  activeTab: "profileDetails",
  usernameError: false,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateGalleryField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearGalleryData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.status = "succeeded";
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setGalleryData, updateGalleryField, clearGalleryData } =
  gallerySlice.actions;

export default gallerySlice.reducer;

export const selectGallery = (state) => state.galleryData;
export const selectGalleryStatus = (state) => state.galleryData.status;
export const selectGalleryError = (state) => state.galleryData.error;

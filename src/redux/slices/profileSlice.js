import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { updateMyField } from "./myDataSlice";
import {
  setProfileEngagement,
  setProfileSubscription,
} from "./profileEngagementSlice";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearProfileData: () => initialState,
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.status = "succeeded";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setProfileData,
  updateProfileField,
  clearProfileData,
  setActiveTab,
} = profileSlice.actions;

export default profileSlice.reducer;

export const selectProfile = (state) => state.profileData;
export const selectProfileStatus = (state) => state.profileData.status;
export const selectProfileError = (state) => state.profileData.error;

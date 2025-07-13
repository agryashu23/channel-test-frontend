import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

const initialState = {
  _id: "",
  name: "",
  visibility: "anyone",
  members: [],
  cover_image: null,
  memberCount: 0,
  admins: [],
  paywallPrice: "",
  topics: [],
  logo: null,
  description: "",
  channelstatus: "idle",
  channelNameError: false,
  isEdit: false,
};

export const createChannelSlice = createSlice({
  name: "createChannel",
  initialState,
  reducers: {
    setSelectedUnsplashImage: (state, action) => {
      state.cover_image = action.payload;
      state.imageSource = "unsplash";
    },
    setCreateChannelItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setCreateChannelField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    createClearChannel: (state) => {
      state.name = "";
      state._id = "";
      state.visibility = "anyone";
      state.cover_image = null;
      state.logo = null;
      state.cover_image = null;
      state.admins = [];
      state.members = [];
      state.name = "";
      state.paywallPrice = "";
      state.description = "";
      state.channelstatus = "idle";
      state.channelNameError = false;
      state.isEdit = false;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   ;
  },
});

export const {
  setSelectedUnsplashImage,
  setCreateChannelField,
  createClearChannel,
  setCreateChannelItems,
} = createChannelSlice.actions;

export default createChannelSlice.reducer;

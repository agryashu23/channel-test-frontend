import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";




export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    admin_notification: {},
    user_notification: {},
    notifications:[],
    loading:false,
    error:null,
   
  },
  reducers: {
    setAdminNotification: (state, action) => {
      state.admin_notification = action.payload;
    },
    setUserNotification: (state, action) => {
      state.user_notification = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearAdminNotification: (state) => {
      state.admin_notification = {};
    },
    clearUserNotification: (state) => {
      state.user_notification = {};
    },
  },
  extraReducers: (builder) => {
    // builder
      
  },
});
export const {
  setAdminNotification,
  setUserNotification,
  clearNotifications,
  clearAdminNotification,
  clearUserNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;

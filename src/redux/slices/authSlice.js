import { createSlice } from "@reduxjs/toolkit";
import { getUserData, getAuthToken } from "./../../services/cookies";
import Cookies from "js-cookie";

const initialState = {
  user:Cookies.get("user")?JSON.parse(Cookies.get("user")):null,
  token: null,
  isLoggedIn: false,
  isOnboarding: false,
  isSubdomain: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
    },
    setOnboarding: (state, action) => {
      state.isOnboarding = action.payload;
    },

    setIsDomain: (state, action) => {
      state.isSubdomain = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    initializeAuth: (state) => {
      const token = getAuthToken();
      const user = getUserData();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isLoggedIn = true;
      } else {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  setCredentials,
  logOut,
  initializeAuth,
  updateUser,
  setOnboarding,
  setIsDomain,
} = authSlice.actions;
export default authSlice.reducer;

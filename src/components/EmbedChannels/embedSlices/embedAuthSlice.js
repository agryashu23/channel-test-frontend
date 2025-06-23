import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localStorage from "../utility/storage_manager";
import { postRequestUnAuthenticated } from "./../../../services/rest";

// Initial State
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("auth-token") || null,
  isLoggedIn: !!localStorage.getItem("auth-token"),
  isOnboarding: false,
};

// Slice
const embedAuthSlice = createSlice({
  name: "embedAuth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setEmbedCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logOutEmbed: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
    },
    setOnboarding: (state, action) => {
      state.isOnboarding = action.payload;
    },
    initializeEmbedAuth: (state) => {
      const storedToken = localStorage.getItem("auth-token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        state.isLoggedIn = true;
      } else {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
      }
    },
  },
});

export const { setEmbedCredentials, logOutEmbed, initializeEmbedAuth } =
  embedAuthSlice.actions;

export const checkAutoLogin = createAsyncThunk(
  "embed-auth/check-auto-login",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/check/auto/login",
        data
      );
      // console.log(response);
      if (response.success) {
        const data = {
          token: response.token,
          user: response.user,
        };
        dispatch(setEmbedCredentials(data));
        return data;
      } else {
        return rejectWithValue(response.message || "Auto login failed");
      }
    } catch (error) {
      console.error("Failed to check auto login:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export default embedAuthSlice.reducer;

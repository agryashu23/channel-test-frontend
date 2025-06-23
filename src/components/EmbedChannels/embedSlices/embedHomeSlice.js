import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
} from "../../../services/rest.js";

// export const removeCover = createAsyncThunk(
//   "channel/remove-cover",
//   async (channelId, { rejectWithValue }) => {
//     try {
//       const response = await postRequestAuthenticated("/remove/channel/cover", {
//         channelId,
//       });
//       if (response.success) {
//         return response.channel;
//       } else {
//         return rejectWithValue(response.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const initialState = {
  channels: [],
  selectedChannel: null,
  selectedTopic: null,
  username: null,
};

export const embedHomeSlice = createSlice({
  name: "embedHome",
  initialState,
  reducers: {
    setEmbedItem: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    clearEmbedItem: (state) => {
      state.channels = [];
      state.selectedChannel = null;
      state.selectedTopic = null;
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(updateChannel.fulfilled, (state, action) => {
    //     if (action.payload._id === state._id) {
    //       Object.assign(state, initialState, action.payload);
    //     }
    //   });
  },
});

export const { setEmbedItem, clearEmbedItem } = embedHomeSlice.actions;

export default embedHomeSlice.reducer;

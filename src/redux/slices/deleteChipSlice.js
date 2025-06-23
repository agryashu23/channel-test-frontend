// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";

export const deleteChip = createAsyncThunk(
  "chips/deleteChip",
  async ({ chipId, profile_category }, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/chip", {
        chip_id: chipId,
      });
      if (response.success) {
        const chip = {
          _id: chipId,
          profile_category: profile_category,
        };
        return chip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chipDeletionSlice = createSlice({
  name: "chipDeletion",
  initialState: {
    chipId: null,
    profile_category: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setChipIdToDelete: (state, action) => {
      state.chipId = action.payload;
    },
    setProfileCategorytoDelete: (state, action) => {
      state.profile_category = action.payload;
    },
    clearChipIdToDelete: (state) => {
      state.chipId = null;
      state.profile_category = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteChip.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteChip.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chipId = null;
        state.profile_category = "";
      })
      .addCase(deleteChip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setChipIdToDelete,
  clearChipIdToDelete,
  setProfileCategorytoDelete,
} = chipDeletionSlice.actions;

export default chipDeletionSlice.reducer;

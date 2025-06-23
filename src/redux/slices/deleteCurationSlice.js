// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "../../services/rest";

export const deleteCuration = createAsyncThunk(
  "curations/deleteCuration",
  async ({ curationId, profile_category }, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/curation", {
        curation_id: curationId,
      });
      if (response.success) {
        const curation = {
          _id: curationId,
          profile_category: profile_category,
        };
        return curation;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const curationDeletionSlice = createSlice({
  name: "curationDeletion",
  initialState: {
    curationId: null,
    profile_category: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setCurationIdToDelete: (state, action) => {
      state.curationId = action.payload;
    },
    setProfileCategoryToDelete: (state, action) => {
      state.profile_category = action.payload;
    },
    clearCurationIdToDelete: (state) => {
      state.curationId = null;
      state.profile_category = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCuration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCuration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curationId = null;
        state.profile_category = "";
      })
      .addCase(deleteCuration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCurationIdToDelete,
  clearCurationIdToDelete,
  setProfileCategoryToDelete,
} = curationDeletionSlice.actions;

export default curationDeletionSlice.reducer;

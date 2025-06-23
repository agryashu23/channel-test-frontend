// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/delete/profile/category",
        { id: categoryId }
      );
      if (response.success) {
        return categoryId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoryDeletionSlice = createSlice({
  name: "categoryDeletion",
  initialState: {
    categoryId: null,
    categoryName: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setCategoryIdToDelete: (state, action) => {
      state.categoryId = action.payload;
    },
    setCategoryNameToDelete: (state, action) => {
      state.categoryName = action.payload;
    },
    clearCategoryIdToDelete: (state) => {
      state.categoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categoryId = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCategoryIdToDelete,
  clearCategoryIdToDelete,
  setCategoryNameToDelete,
} = categoryDeletionSlice.actions;

export default categoryDeletionSlice.reducer;

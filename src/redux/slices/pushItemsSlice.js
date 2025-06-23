// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";
import { createCategory, createCuration } from "./profileItemsSlice";
import { deleteCategory } from "./deleteCategorySlice";

export const fetchCategories = createAsyncThunk(
  "pushItems/fetchprofileCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/profile/categories"
      );
      if (response.success) {
        return response.categories;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoriesOrder = createAsyncThunk(
  "pushItems/updateprofileCategoriesOrder",
  async (categories, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/profile/categories/order",
        { categories }
      );
      if (response.success) {
        return response.categories;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateItemsOrderCategory = createAsyncThunk(
  "pushItems/updateItemsOrderCategory",
  async (items, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/items/order/category",
        { items }
      );
      if (response.success) {
        return response.categories;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurations = createAsyncThunk(
  "pushItems/fetchprofileCurations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/my/curations");
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const pushItemToCategory = createAsyncThunk(
  "pushItems/Tocategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/push/item/to/category",
        formData
      );
      if (response.success) {
        return response.item;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const pushChipToCuration = createAsyncThunk(
  "pushItems/Tocuration",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/push/chip/to/curation",
        formData
      );
      if (response.success) {
        const data = {
          chip: response.chip,
          profile_category: response.profileCategory,
          curation_id: response.oldCuration,
          new_curation_id: response.newCuration,
        };
        return data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pushItemsSlice = createSlice({
  name: "pushItems",
  initialState: {
    id: null,
    type: "",
    selectedCategoryId: null,
    existingCategoryId: null,
    selectedCurationId: null,
    existingCurationId: null,
    reorderItems: [],
    status: "idle",
    error: null,
    categories: [],
    curations: [],
    categoryStatus: "idle",
  },
  reducers: {
    updateItemField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearItems: (state) => {
      state.id = null;
      state.type = "";
      state.selectedCategoryId = null;
      state.selectedCurationId = null;
      state.existingCurationId = null;
      state.existingCategoryId = null;
    },
    updateReorderItems: (state, action) => {
      const { itemId, newCategoryId, type } = action.payload;
      const itemExists = state.reorderItems.find(
        (item) => item.itemId === itemId
      );

      if (itemExists) {
        state.reorderItems = state.reorderItems.map((item) =>
          item.itemId === itemId ? { ...item, newCategoryId, type } : item
        );
      } else {
        state.reorderItems.push({ itemId, newCategoryId, type });
      }
    },

    clearReorderItems: (state) => {
      state.reorderItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pushItemToCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(pushItemToCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(pushItemToCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(pushChipToCuration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(pushChipToCuration.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(pushChipToCuration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })

      .addCase(updateCategoriesOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategoriesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(updateItemsOrderCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateItemsOrderCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        const category = action.payload;
        state.categories.unshift(category);
      })
      .addCase(createCuration.fulfilled, (state, action) => {
        state.status = "succeded";
        const curation = action.payload;
        state.curations.unshift(curation);
      })
      .addCase(fetchCurations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curations = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const categoryId = action.payload;
        const index = state.categories.findIndex(
          (item) => item._id === categoryId
        );
        if (index !== -1) {
          state.categories.splice(index, 1);
        }
      });
  },
});

export const {
  updateItemField,
  clearItems,
  updateReorderItems,
  clearReorderItems,
} = pushItemsSlice.actions;

export default pushItemsSlice.reducer;

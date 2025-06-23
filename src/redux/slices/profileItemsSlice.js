import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
  postRequestUnAuthenticated,
} from "./../../services/rest";
import { deleteChip } from "./deleteChipSlice";
import { createChipComment, createChipCommentReply } from "./commentChipSlice";
import { deleteCategory } from "./deleteCategorySlice";
import { deleteCuration } from "./deleteCurationSlice";
import {
  pushItemToCategory,
  pushChipToCuration,
  updateCategoriesOrder,
} from "./pushItemsSlice";

export const fetchProfileItems = createAsyncThunk(
  "profileItems/fetchItems",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/profile/category/chips/curations",
        { user_id }
      );
      if (response.success) {
        return response.categorizedItems;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchlimitedProfileItems = createAsyncThunk(
  "profileItems/limited/fetchItems",
  async (userId, { rejectWithValue }) => {
    clearItems();

    try {
      const response = await postRequestUnAuthenticated(
        "/limited/profile/chips/curations",
        { userId }
      );
      if (response.success) {
        return response.items;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createCategory = createAsyncThunk(
  "profileItems/createCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/profile/category",
        category
      );
      if (response.success) {
        return response.category;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "profileItems/editCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/profile/category",
        category
      );
      if (response.success) {
        return response.category;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createChip = createAsyncThunk(
  "profileItems/createChip",
  async (newChipData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/chip",
        newChipData
      );
      if (response.success) {
        return response.chip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateChip = createAsyncThunk(
  "profileItems/updateChip",
  async (updatedChipData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/edit/chip",
        updatedChipData
      );
      if (response.success) {
        return response.chip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createCuration = createAsyncThunk(
  "profileItems/createCuration",
  async (newChipData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/curation",
        newChipData
      );
      if (response.success) {
        return response.curation;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCuration = createAsyncThunk(
  "profileItems/updateCuration",
  async (updatedCurationData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/edit/curation",
        updatedCurationData
      );
      if (response.success) {
        return response.curation;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGalleryItems = createAsyncThunk(
  "profilegalleryItems/fetchItems",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/gallery/category/chips/curations",
        { username }
      );
      if (response.success) {
        return response.categorizedItems;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const upvoteChip = createAsyncThunk(
  "profileItems/upvoteChip",
  async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/upvote/chip", {
        chip_id: chipId,
      });
      // console.log(response);
      if (response.success) {
        return response.updatedChip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const saveChip = createAsyncThunk(
  "profileItems/saveChip",
  async ({ chipId, curationId, originId }, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/save/chip", {
        chip_id: chipId,
        curation_id: curationId,
        origin_id: originId,
      });
      if (response.success) {
        return response.updatedChip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const shareChips = createAsyncThunk(
  "chips/shareChip",
  async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/chip/sharedby", {
        chip_id: chipId,
      });
      if (response.success) {
        return response.chip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const profileItemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    status: "idle",
    fetchedOnce: false,
    error: null,
    chipstatus: "idle",
    chiperror: null,
    curationstatus: "idle",
    curationerror: null,
    type: "",
    category: {
      _id: "",
      name: "",
      expanded: true,
      featured: false,
    },
    categorystatus: "idle",
  },
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
    updateCategoryField: (state, action) => {
      const { field, value } = action.payload;
      state.category[field] = value;
    },
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearCategory: (state) => {
      
      state.type = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileItems.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
        state.fetchedOnce = true;
      })
      .addCase(fetchProfileItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGalleryItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGalleryItems.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
        state.fetchedOnce = true;
      })
      .addCase(fetchGalleryItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchlimitedProfileItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchlimitedProfileItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchlimitedProfileItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createChip.pending, (state) => {
        state.chipstatus = "loading";
      })
      .addCase(createChip.fulfilled, (state, action) => {
        state.chipstatus = "succeeded";
        const categoryId = action.payload.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index === -1 && categoryId === "") {
          state.items.push({ _id: "", name: "", items: [] });
          index = state.items.length - 1;
        }
        if (index !== -1) {
          state.items[index].items.unshift(action.payload);
        }
      })
      .addCase(createChip.rejected, (state, action) => {
        state.chipstatus = "failed";
        state.error = action.payload;
      })
      .addCase(createCuration.pending, (state) => {
        state.curationstatus = "loading";
      })
      .addCase(createCuration.fulfilled, (state, action) => {
        state.curationstatus = "succeeded";
        const categoryId = action.payload.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index === -1 && categoryId === "") {
          state.items.push({ _id: "", name: "", items: [] });
          index = state.items.length - 1;
        }
        if (index !== -1) {
          state.items[index].items.unshift(action.payload);
        }
      })
      .addCase(createCuration.rejected, (state, action) => {
        state.curationstatus = "failed";
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categorystatus = "succeeded";
        let category = action.payload;
        category.items = [];
        state.items.unshift(category);
      })
      .addCase(createCategory.pending, (state) => {
        state.categorystatus = "loading";
      })
      .addCase(updateCuration.pending, (state) => {
        state.curationstatus = "loading";
      })
      .addCase(updateCuration.fulfilled, (state, action) => {
        state.curationstatus = "succeeded";
        const categoryId = action.payload.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const curationIndex = state.items[index].items.findIndex(
            (curation) => curation._id === action.payload._id
          );
          if (curationIndex !== -1) {
            state.items[index].items[curationIndex] = action.payload;
          }
        }
      })
      .addCase(updateCategory.pending, (state) => {
        state.categorytatus = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categorytatus = "succeeded";
        const index = state.items.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index].name = action.payload.name;
        }
      })
      .addCase(updateCuration.rejected, (state, action) => {
        state.curationstatus = "failed";
        state.curationerror = action.payload || action.error.message;
      })
      .addCase(updateChip.pending, (state, action) => {
        state.chipstatus = "loading";
      })
      .addCase(updateChip.rejected, (state, action) => {
        state.curationstatus = "failed";
      })
      .addCase(updateChip.fulfilled, (state, action) => {
        state.chipstatus = "succeeded";
        const categoryId = action.payload.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === action.payload._id
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex] = action.payload;
          }
        }
      })

      .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const categoryId = updatedComment.profile_category || "";
        const index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === updatedComment.chipId
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex].comments += 1;
          }
        }
      })
      .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;

        const categoryId = updatedReply.profile_category || "";
        const index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === updatedReply.parentCommentId.chipId
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex].comments += 1;
          }
        }
      })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const categoryId = updatedChip.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === action.payload._id
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex].upvotes = updatedChip.upvotes;
          }
        }
      })
      .addCase(shareChips.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const categoryId = updatedChip.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === action.payload._id
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex].shared_by =
              updatedChip.shared_by;
          }
        }
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const categoryId = updatedChip.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === action.payload._id
          );
          if (chipIndex !== -1) {
            state.items[index].items[chipIndex].saved_by = updatedChip.saved_by;
          }
        }
      })
      .addCase(deleteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        console.log(updatedChip._id);
        const categoryId = updatedChip.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (chipIndex !== -1) {
            state.items[index].items.splice(chipIndex, 1);
          }
        }
      })
      .addCase(deleteCuration.fulfilled, (state, action) => {
        const updatedCuration = action.payload;
        const categoryId = updatedCuration.profile_category || "";
        let index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const curationIndex = state.items[index].items.findIndex(
            (cur) => cur._id === updatedCuration._id
          );
          if (curationIndex !== -1) {
            state.items[index].items.splice(curationIndex, 1);
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const categoryId = action.payload;
        const index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const itemsToRedistribute = state.items[index].items;
          state.items.splice(index, 1);
          const index2 = state.items.findIndex((item) => item._id === "");
          if (index2 !== -1) {
            state.items[index2].items = [
              ...state.items[index2].items,
              ...itemsToRedistribute,
            ];
          }
        }
      })
      .addCase(pushItemToCategory.fulfilled, (state, action) => {
        const payload = action.payload;
        const initialCategoryId = payload.initialCategory || "";
        let index = state.items.findIndex(
          (item) => item._id === initialCategoryId
        );
        if (index !== -1) {
          const itemIndex = state.items[index].items.findIndex(
            (item) => item._id === payload._id
          );
          if (itemIndex !== -1) {
            state.items[index].items.splice(itemIndex, 1);
          }
        }
        const categoryId = payload.profile_category || "";
        index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          state.items[index].items.unshift(action.payload);
        }
      })
      .addCase(pushChipToCuration.fulfilled, (state, action) => {
        const data = action.payload;
        const categoryId = data.profile_category || "";
        const index = state.items.findIndex((item) => item._id === categoryId);
        if (index !== -1) {
          const chipIndex = state.items[index].items.findIndex(
            (item) => item._id === data.chip._id
          );
          if (chipIndex !== -1) {
            state.items[index].items.splice(chipIndex, 1);
          }
        }
      })
      .addCase(updateCategoriesOrder.fulfilled, (state, action) => {
        const categories = action.payload;
        const emptyIndex = state.items.findIndex(
          (item) => item._id === "" || item.name === ""
        );
        const emptyCategory = state.items[emptyIndex];
        state.items = categories.reduce((result, category) => {
          const categoryIndex = state.items.findIndex(
            (item) => item._id === category._id
          );
          if (categoryIndex !== -1) {
            result.push(state.items[categoryIndex]);
          }
          return result;
        }, []);
        if (emptyCategory) {
          state.items.push(emptyCategory);
        }
      });
  },
});

export const { clearItems, updateCategoryField, clearCategory, updateField } =
  profileItemsSlice.actions;

export default profileItemsSlice.reducer;
export const selectProfileItemsStatus = (state) => state.profileItems.status;
export const selectProfileItemsError = (state) => state.profileItems.error;

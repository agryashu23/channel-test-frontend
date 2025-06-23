// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const curationSlice = createSlice({
  name: "curation",
  initialState: {
    name: "",
    visibility: "anyone",
    image: null,
    description: "",
    imageSource: "",
    category: "",
    type: "",
    _id: "",
    curationNameError: false,
    profile_category: "",
  },
  reducers: {
    setSelectedUnsplashImage: (state, action) => {
      state.image = action.payload;
      state.imageSource = "unsplash";
    },
    setCurationField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearCuration: (state) => {
      state.name = "";
      state.visibility = "anyone";
      state.image = null;
      state.description = "";
      state.imageSource = "";
      state.category = "";
      state.type = "";
      state._id = "";
      state.curationNameError = false;
    },
  },
});

export const { setSelectedUnsplashImage, setCurationField, clearCuration } =
  curationSlice.actions;

export default curationSlice.reducer;

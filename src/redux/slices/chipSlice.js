// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const chipSlice = createSlice({
  name: "chip",
  initialState: {
    text: "",
    curation: "",
    category: "",
    visibility: "anyone",
    location: {
      text: "",
      url: "",
      exclusive: false,
    },
    document: {
      name: "",
      pages: "",
      url: "",
      exclusive: false,
    },
    link: "",
    date: {
      date: "",
      event: "",
      start_time: "",
      end_time: "",
      exclusive: false,
    },
    upvotes: [],
    shared_by: [],
    saved_by: [],
    comments: {
      id: "",
      text: "",
    },
    image_urls: [],
    link_exclusive: false,
    text_exclusive: false,
    profile_category: "",
  },
  reducers: {
    setChipField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setLocationField: (state, action) => {
      const { field, value } = action.payload;
      state.location[field] = value;
    },
    setDateField: (state, action) => {
      const { field, value } = action.payload;
      state.date[field] = value;
    },
    setDocumentField: (state, action) => {
      const { field, value } = action.payload;
      state.document[field] = value;
    },
    setImageField: (state, action) => {
      const { field, value } = action.payload;
      state.image_urls[field].exclusive = value;
    },
    setAllImagesField: (state, action) => {
      const { value } = action.payload;
      state.image_urls = state.image_urls.map((image) => ({
        ...image,
        exclusive: value,
      }));
    },
    addImageUrl: (state, action) => {
      state.image_urls.push(action.payload);
    },
    removeImageUrl: (state, action) => {
      state.image_urls = state.image_urls.filter(
        (_, index) => index !== action.payload
      );
    },
    clearChip: (state) => {
      state.text = "";
      state.curation = "";
      state.category = "";
      state.visibility = "anyone";
      state.location = {
        text: "",
        url: "",
        exclusive: false,
      };
      state.document = {
        name: "",
        pages: "",
        url: "",
        exclusive: false,
      };
      state.link = "";
      state.date = {
        date: "",
        event: "",
        start_time: "",
        end_time: "",
        exclusive: false,
      };
      state.comments = {
        id: "",
        text: "",
      };
      state.image_urls = [];
      state.link_exclusive = false;
      state.text_exclusive = false;
    },
  },
});

export const {
  setChipField,
  setDocumentField,
  setLocationField,
  setDateField,
  addImageUrl,
  setImageField,
  setAllImagesField,
  removeImageUrl,
  clearChip,
} = chipSlice.actions;

export default chipSlice.reducer;

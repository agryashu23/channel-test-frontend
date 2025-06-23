// redux/slices/curationSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const editChipSlice = createSlice({
  name: 'editChip',
  initialState: {
    _id:'',
    text: '',
    curation:'',
    category:'',
    visibility: '',
    location: {
        text:'',
        url:'',
        exclusive:false
    },
    document:{
      name:'',
      pages:'',
      url:'',
      exclusive:false,
    },
    metaLink:{},
    link: '',
    date:{
        date:'',
        event:'',
        start_time:'',
        end_time:'',
        exclusive:false
    },
    upvotes:[],
    shared_by:[],
    saved_by:[],
    comments:[],
    image_urls: [],
    link_exclusive:false,
    text_exclusive:false,
  },
  reducers: {
    setEditChipData: (state, action) => {
      return { ...state, ...action.payload };
    },
    setEditChipField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setEditLocationField: (state, action) => {
      const { field, value } = action.payload;
      state.location[field] = value;
    },
    setEditDocumentField: (state, action) => {
      const { field, value } = action.payload;
      state.document[field] = value;
    },
    setEditDateField: (state, action) => {
      const { field, value } = action.payload;
      state.date[field] = value;
    },
    setEditImageField: (state, action) => {
      const { field, value } = action.payload;
      state.image_urls[field].exclusive = value;
    },
    setEditAllImagesField: (state, action) => {
      const { value } = action.payload;
      state.image_urls = state.image_urls.map((image) => ({
        ...image,
        exclusive: value,
      }));
    },
    addEditImageUrl: (state, action) => {
      state.image_urls.push(action.payload);
    },
    removeEditImageUrl: (state, action) => {
      state.image_urls = state.image_urls.filter(image => image.id !== action.payload);
    },
    clearEditChip: (state) => {
      state.text = '';
      state.curation = '';
      state._id = '';
      state.category = '';
      state.visibility = 'anyone';
      state.location = {
        text: '',
        url: '',
        exclusive: false
      };
      state.document = {
        name:'',
        pages:'',
        url:'',
        exclusive:false,
      };
      state.link = '';
      state.date = {
        date: '',
        event: '',
        start_time: '',
        end_time: '',
        exclusive: false
      };
      state.comments = [];
      state.image_urls = [];
      state.link_exclusive=false;
      state.text_exclusive=false;
    }
  },
});

export const {setEditChipField,setEditDocumentField, setEditChipData,setEditImageField, setEditAllImagesField,setEditLocationField, setEditDateField, addEditImageUrl, removeEditImageUrl, clearEditChip} = editChipSlice.actions;

export default editChipSlice.reducer;
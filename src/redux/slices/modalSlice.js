// src/redux/slices/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalLoginOpen: false,
  modalChannelOpen: false,
  modalTopicOpen: false,
  modalChipOpen: false,
  modalChipEditOpen: false,
  modalCustomTagOpen: false,
  modalOnboardOpen: false,
  modalCurationUnsplashOpen: false,
  modalUnsplashModalOpen: false,
  modalChannelUnsplashOpen: false,
  modalLeaveTopicOpen: false,
  modalLeaveChannelOpen: false,
  modalChannelCoverOpen: false,
  modalNewsletterUnsplashOpen: false,
  modalSaveChipOpen: false,
  modalPrivacyOpen: false,
  modalTermsOpen: false,
  modalLogoutOpen: false,
  modalEmbedLogoutOpen: false,
  modalFeedbackOpen: false,
  modalChipDeleteOpen: false,
  modalCurationDeleteOpen: false,
  modalChatDeleteOpen: false,
  modalRemoveMemberOpen: false,
  modalRemoveTopicMemberOpen: false,
  modalShareOpen: false,
  modalEventOpen: false,
  modalPollOpen: false,
  modalEventCardOpen: false,
  modalShareChipOpen: false,
  modalShareChannelOpen: false,
  modalInviteOpen: false,
  modalDeleteChannelOpen: false,
  modalShareTopicOpen: false,
  modalDeleteTopicOpen: false,
  modalShareEventOpen: false,
  modalDeletePollOpen:false,
  modalShareProfileOpen: false,
  modalTokenExpiryOpen: false,
  modalUnsubscriptionOpen: false,
  modalCreateCategoryOpen: false,
  modalPaymentSuccessOpen:false,
  modalPaymentOpen:false,
  modalCategoryDeleteOpen: false,
  modalPushtoCategoryOpen: false,
  modalPushtoCurationOpen: false,
  modalCategoryReorderOpen: false,
  modalTopicReorderOpen: false,
  modalFaqDeleteOpen: false,
  modalDocumentOpen: false,
  modalCommentOpen: false,
  document: null,
  shareLink: "",
  shareUsername: "",
  isLoginMode: false,
  profileId: "",
  channelId: "",
  isTabChannel: false,
  type:"",
  channelName: "",
  topicId: "",
  topicName: "",
  event: {},
  eventId: "",
  pollId:""
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setLoginMode: (state, action) => {
      state.isLoginMode = action.payload;
    },
    clearEventItem: (state, action) => {
      state.chatId = "";
      state.event = {};
    },
    setModalModal: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearEventIdToDelete: (state, action) => {
      state.eventId = "";
    },
    clearPollIdToDelete: (state, action) => {
      state.pollId = "";
    },
    openModal: (state, action) => {
      const { modalName, link } = action.payload;
      state[modalName] = true;
      if (
        modalName === "modalShareChipOpen" ||
        modalName === "modalShareProfileOpen"
      ) {
        state.shareLink = link;
      }
      if (modalName === "modalUnsubscriptionOpen") {
        state.shareUsername = link;
      }

       if (modalName === "modalShareChannelOpen") {
         state.channelId = link;
       }
      if (modalName === "modalShareTopicOpen") {
        state.topicId = link;
      }
      if (modalName === "modalTopicReorderOpen") {
        state.channelId = link;
      }
      if (modalName === "modalDocumentOpen") {
        state.document = {
          url: link.url,
          name: link.name,
          pages: link.pages,
        };
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = false;
      if (
        modalName === "modalShareChipOpen" ||
        modalName === "modalShareProfileOpen"
      ) {
        state.shareLink = "";
      }
      if (modalName === "modalUnsubscriptionOpen") {
        state.shareUsername = "";
      }
      if(modalName==="modalInviteOpen"){
        state.type="";
        state.channelId="";
        state.topicId="";
      }
      if (modalName === "modalDocumentOpen") {
        state.document = null;
      }
      if (modalName === "modalTopicReorderOpen") {
        state.channelId = "";
      }

       if (modalName === "modalShareChannelOpen") {
         state.channelId = "";
       }
      if (modalName === "modalShareTopicOpen") {
        state.topicId = "";
        state.channelId = "";
      }
    },
  },
});

export const {
  openModal,
  closeModal,
  setLoginMode,
  setModalModal,
  clearEventItem,
  clearEventIdToDelete,
  clearPollIdToDelete
} = modalSlice.actions;

export default modalSlice.reducer;

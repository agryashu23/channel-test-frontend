import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutEmbed } from "../EmbedChannels/embedSlices/embedAuthSlice";
import { closeModal } from "../../redux/slices/modalSlice";
import { googleLogout } from "@react-oauth/google";
import StorageManager from "./../EmbedChannels/utility/storage_manager";
import { clearMyData } from "../../redux/slices/myDataSlice";

const EmbedLogoutModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalEmbedLogoutOpen);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOutEmbed());
    googleLogout();
    dispatch(clearMyData());
    handleClose();
    const data = localStorage.getItem("embedFetchedData");
    if (data) {
      const dataId = JSON.parse(data);
      const channelId = dataId.selectedChannel;
      const username = dataId.username;
      navigate(`/embed/channels/account/${username}/channel/${channelId}`, {
        replace: true,
      });
    } else {
      navigate(`/embed/channels/get-started`, {
        replace: true,
      });
    }
  };
  const handleClose = () => {
    dispatch(closeModal("modalEmbedLogoutOpen"));
  };
  if (!isOpen) return null;
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Logout
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-normal font-inter">
                Do you really want to logout from channels?
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full text-theme-primaryBackground bg-theme-secondaryText  font-normal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full text-theme-secondaryText border border-theme-secondaryText font-normal"
                  onClick={handleLogout}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default EmbedLogoutModal;

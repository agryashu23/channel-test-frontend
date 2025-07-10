import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  deleteTopicChat,
  clearChatIdToDelete,
} from "../../../redux/slices/chatSlice";
import socket from "../../../utils/socket";
import { useNavigate } from "react-router-dom";

const AdminNotificationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.modals.modalNotificationOpen);
  const notification = useSelector((state) => state.notification.admin_notification);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal("modalNotificationOpen"));
  };

  const handleNotification = () => {
    handleClose();
    if(notification.isBusiness){
      navigate(`/admin/${notification.username}/account/billing`);
    }
    else{
      navigate("/pricing");
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Plan Limit Reached
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="border-t border-theme-chatDivider w-full my-3"></div>
              <div className="mt-2 text-theme-secondaryText font-normal font-inter">
                {notification.message}
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full text-theme-primaryBackground bg-theme-secondaryText  font-normal"
                  onClick={handleNotification}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AdminNotificationModal;

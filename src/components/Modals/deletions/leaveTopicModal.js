import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { setModalModal } from "../../../redux/slices/modalSlice.js";
import { leaveTopic } from "../../../redux/slices/reorderTopicSlice";

const LeaveTopicModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalLeaveTopicOpen);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const topicId = useSelector((state) => state.modals.topicId);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal("modalLeaveTopicOpen"));
    dispatch(setModalModal({ field: "topicId", value: "" }));
  };

  const handleLeave = () => {
    if (isLoggedIn) {
      dispatch(leaveTopic(topicId))
        .unwrap()
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to delete channel:", error);
        });
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Exit this Topic?
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-light font-inter">
                You'll lose access to all its content and updates.
              </div>
              <div className="mt-2 text-theme-secondaryText font-light font-inter">
                To come back, you'll need to request to join again.
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full text-theme-secondaryText bg-transparent border border-theme-secondaryText font-normal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full text-theme-primaryBackground bg-theme-secondaryText font-normal"
                  onClick={handleLeave}
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

export default LeaveTopicModal;

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../../assets/icons/Close.svg";
import { useDispatch } from "react-redux";
import { removeUserBusinessMember } from "../../../../redux/slices/businessSlice";


const RemoveBusinessMemberModal = ({ userId, channelId, topicId, onClose,username }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("channelId", channelId);
    formDataToSend.append("userId", userId);
    formDataToSend.append("topicId", topicId);
    dispatch(removeUserBusinessMember(formDataToSend))
      .unwrap()
      .then(() => {
        onClose(); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
          <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal">
                  Remove member
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-normal">
                Do you really want to remove {username?username:"user"}?
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full text-theme-secondaryText bg-transparent border border-theme-secondaryText font-normal"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full text-theme-primaryBackground bg-theme-secondaryText font-normal"
                  onClick={handleRemove}
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

export default RemoveBusinessMemberModal;

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import useModal from "./../hooks/ModalHook";

const TokenExpiryModal = () => {
  const isOpen = useSelector((state) => state.modals.modalTokenExpiryOpen);

  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleLogin = () => {
    dispatch(closeModal("modalTokenExpiryOpen"));
    handleOpenModal("modalLoginOpen");
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl transform transition-all sm:w-1/2  md:w-2/5 lg:w-[30%]">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5 justify-start">
              <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                Token Expired
              </h2>
              <div
                className={`w-[100%] my-2 border border-borderColor`}
                style={{ height: "1px" }}
              ></div>
              <div className="mt-2 text-primaryGrey font-light font-inter">
                Your session has expired. Please log in again.
              </div>
              <div className="flex justify-end items-center">
                <button
                  className="w-1/3 py-2.5 mt-3 rounded-full text-primary bg-chipBackground border  border-primary font-normal"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TokenExpiryModal;

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeAuthCookies } from "./../../services/cookies";
import { logOut } from "../../redux/slices/authSlice";
import { closeModal } from "../../redux/slices/modalSlice";
import { googleLogout } from "@react-oauth/google";
import { clearMyData } from "../../redux/slices/myDataSlice";

const LogoutModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalLogoutOpen);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    removeAuthCookies();
    dispatch(clearMyData());
    googleLogout();
    setTimeout(() => {
      window.google?.accounts.id.prompt();
    }, 2000);

    navigate("/", { replace: true });
  };
  const handleClose = () => {
    dispatch(closeModal("modalLogoutOpen"));
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
                Do you really want to logout?
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
export default LogoutModal;

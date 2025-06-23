import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";

const PrivacyPolicy = () => {
  const [markdown, setMarkdown] = useState("");

  const dispatch = useDispatch();
  const isOpenPrivacy = useSelector((state) => state.modals.modalPrivacyOpen);

  useEffect(() => {
    if (!isOpenPrivacy) return;
  
    fetch("https://raw.githubusercontent.com/Chips-social/chips-constants/main/privacy-policy.md")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then((text) => setMarkdown(text))
      .catch((error) => {
        console.error("Error fetching markdown file:", error);
        setMarkdown("Failed to load privacy policy.");
      });
  }, [isOpenPrivacy]);

  const handlePrivacyClose = () => {
    dispatch(closeModal("modalPrivacyOpen"));
  };
  const handleOverlayClick = () => {
    dispatch(closeModal("modalPrivacyOpen"));
  };

  if (!isOpenPrivacy) return null;

  return (
    <Dialog.Root open={isOpenPrivacy}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 "
          onClick={handleOverlayClick}
        />
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <Dialog.Content
            className=" bg-theme-primaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[75%] overflow-y-auto custom-scrollbar w-3/4 md:w-1/2 lg:w-1/3 py-5 pl-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />

            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4 pr-3">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter ">
                  Privacy Policy
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handlePrivacyClose}
                />
              </div>
              <div
                className="flex-grow overflow-y-auto text-theme-secondaryText text-sm font-inter"
                style={{ lineHeight: "1.5" }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PrivacyPolicy;

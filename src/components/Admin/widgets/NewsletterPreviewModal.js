import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useSelector } from "react-redux";
import { ChannelImages } from "../../constants/images";

const NewsletterPreviewModal = ({ isOpen, setIsOpen }) => {
  const newsletter = useSelector((state) => state.newsletter);

  const handleClose = () => setIsOpen(false);

  const renderBlock = (block) => {
    switch (block.type) {
      case "header":
        return (
          <h1 className="text-xl font-semibold text-white mb-4">
            {block.content}
          </h1>
        );
      case "text":
        return (
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {block.content}
          </p>
        );
      case "image":
        return (
          block.preview && (
            <img
              src={block.preview}
              alt="Newsletter"
              className="w-full max-h-36 rounded-md mb-4 object-cover"
            />
          )
        );
      case "button":
        return (
          <div className="w-full text-center my-4">
            <a
              href={block.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-2 bg-blue-500 text-white text-sm font-normal rounded-lg"
            >
              {block.content || "Click Here"}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
        />
        <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto">
        <Dialog.Content className="bg-[#2c2c2c] rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%]
           max-h-[90%] overflow-y-auto custom-scrollbar w-[90%] xs:w-3/4 sm:w-3/5 md:w-1/2 lg:w-[35%] xl:w-[30%] pt-3 pl-5 pr-3">
            <Dialog.Title />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-normal text-white">Newsletter Preview</h2>
              <img
                src={Close}
                alt="Close"
                onClick={handleClose}
                className="cursor-pointer w-5 h-5"
              />
            </div>

            {newsletter.subject && (
              <h3 className="text-base font-semibold text-white mb-2">
                {newsletter.subject}
              </h3>
            )}
            {newsletter.contentBlocks.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}

            <div className="border-t border-[#3c3c3c] w-full my-3"></div>
            <div className="flex flex-row justify-between items-center mt-4">
                <div className="flex flex-row items-center">
                    <img src={ChannelImages.HomeImage} alt="footer logo" className="w-8 h-8 rounded-full object-cover" />
                    <p className="text-white text-sm font-normal ml-2">Channel Name</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xs text-[#898989]">Newsletter powered by</p>
                    <img src={ChannelImages.ChannelLogo.default} alt="channel logo" className="h-6 mt-1" />
                </div>
            </div>
            <div className="text-sm text-[#898989] my-6">© 2020 Chips2Connect Pvt. Ltd. All rights reserved.</div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewsletterPreviewModal;
